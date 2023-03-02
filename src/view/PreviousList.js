import { Box, IconButton, MenuItem, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect, useCallback } from 'react';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import WarningIcon from '@material-ui/icons/Warning';
import copy from 'copy-to-clipboard';
import { useHistory } from 'react-router-dom';

import { ReactComponent as RunningSvg } from '../assets/icons/running.svg';
import { axiosUtil } from '../services/axiosinstance';
import { formatDateTime } from '../services/utils';
import CustomTable from '../common/Table';
import { previousListsStyles } from '../styles/view/previousLists';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { useAuth } from '../services/Auth';
import Controls from '../common/controls/Controls';
import config from '../services/config';
import { INSTALLMENT_PENDING } from '../services/constants';
import handleError from '../services/handleError';
import { triggerAlert } from '../services/getAlert/getAlert';

const useEventSource = taskId => {
  const [data, updateData] = useState(null);
  const url = `${config.apiUrl}/api/status/?id=${taskId}`;
  useEffect(() => {
    if (taskId) {
      const source = new EventSource(url);

      // source.onmessage = function logEvents(event) {
      //   updateData(JSON.parse(event.data));
      // };
      source.addEventListener('update', e => {
        updateData(JSON.parse(e.data));
      });
      source.addEventListener('close', e => {
        updateData(JSON.parse(e.data));
        source.close();
      });
      return () => source.close();
    }
  }, [url, taskId]);

  return taskId ? data : null;
};

export default function PreviousList() {
  const classes = previousListsStyles();
  const [lists, setLists] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [timeout, setTimeout] = useState(60000);
  const [revertLoading, setRevertLoading] = useState(false);
  const { client, user } = useAuth();

  const history = useHistory();

  const fetchList = useCallback(async () => {
    const collection = await client.db('poaa').collection('lists');
    const data = await collection.aggregate([{ $sort: { _id: -1 } }, { $limit: 20 }]);
    setLists(data);
  }, [client]);

  const formatErrorMessage = message => {
    const regexTemp = /(waiting for) .*/;
    const match = message?.match(regexTemp);
    if (match?.length >= 2 && match[1] === 'waiting for')
      return 'DOP server was slow. Please try again!';

    return message;
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const selectedRecord = lists?.length > 0 ? lists[selectedRecordIndex] : {};
  const selectedList =
    selectedRecord?.list?.length > 0 ? selectedRecord?.list[selectedListIndex] : {};

  const taskStats = useEventSource(selectedRecord?.taskId);

  const handleChangeList = e => {
    const { value } = e.target;
    setSelectedRecordIndex(value);
    setSelectedListIndex(0);
  };

  const copyToClipboard = () => {
    copy(selectedList.accounts.map(record => record.accountNo).toString());
  };

  const changeListNo = change => {
    setSelectedListIndex(prevState => prevState + change);
  };

  const handleChangeTimeout = e => {
    const { value } = e.target;
    setTimeout(value);
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: '15em' },
    { id: 'paidInstallments', label: 'Installments', align: 'center' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'totalAmount', label: 'Total Amount', minWidth: '10em', align: 'right' },
    { id: 'accountNo', label: 'Account No.', minWidth: '8em', align: 'center' },
  ];

  const timeoutArray = [
    { timeout: 30000, text: 'DoP is very fast.' },
    { timeout: 45000, text: 'DoP is fast.' },
    { timeout: 60000, text: 'DoP is ok.' },
    { timeout: 75000, text: 'DoP is slow.' },
    { timeout: 90000, text: 'DoP is very slow.' },
  ];

  if (!lists) return <LoaderSVG />;

  const rows = selectedList?.accounts
    ?.sort((a, b) => {
      return b.paidInstallments - a.paidInstallments;
    })
    .map(acc => acc);

  const handleGenerateList = e => {
    e.preventDefault();
    setIsLoading(true);
    axiosUtil
      .post('/schedule/create-list', { id: selectedRecord._id, timeout })
      .then(res => {
        setLists(prevState =>
          prevState.map(ele => {
            if (ele._id === selectedRecord._id) return { ...ele, taskId: res.data.taskId };
            return ele;
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRevertList = async e => {
    e.preventDefault();
    try {
      setRevertLoading(true);
      const data = {};
      selectedRecord.list.forEach(list => {
        list.accounts.forEach(inst => {
          data[inst.accountNo] = {
            ...inst,
            installments: (data[inst.accountNo]?.installments || 0) + inst.paidInstallments,
          };
        });
      });

      const bulk = Object.keys(data).map(ele => {
        return {
          updateOne: {
            filter: { accountNo: data[ele].accountNo },
            update: {
              $set: {
                accountNo: data[ele].accountNo,
                amount: data[ele].amount,
                agentId: user.id,
                createdAt: new Date(Date.now()),
                installments: data[ele].installments,
                name: data[ele].name,
                status: INSTALLMENT_PENDING,
              },
            },
            upsert: true,
          },
        };
      });

      await user.functions.revertList(bulk, selectedRecord._id);
      history.push('/generate-list');
    } catch (error) {
      handleError(error, triggerAlert);
      setRevertLoading(false);
    }
  };

  const handleAbortListGeneration = () => {
    const { pid, browserPid, _id: id } = taskStats;
    const processIds = [];
    if (pid) processIds.push(pid);
    if (browserPid) processIds.push(browserPid);
    axiosUtil.post('/abortProcesses', { id, processIds }).then(res => {
      triggerAlert({ icon: 'success', title: res.data });
    });
  };

  const calcTime = (t1, t2) => {
    const timeDiff = (new Date(t1) - new Date(t2)) / 60000;
    return `${timeDiff.toFixed(2)} Sec`;
  };

  return (
    <Paper classes={{ root: classes.root }}>
      <header className={classes.headerWrapper}>
        <Typography variant="h5" className={classes.heading}>
          All Lists
        </Typography>
        {lists?.length ? (
          <Controls.Button
            text="Edit List"
            startIcon={<EditIcon />}
            disabled={
              (selectedRecord?.taskId && !taskStats) ||
              ['Running', 'Initiated', 'Done'].includes(taskStats?.status) ||
              isLoading ||
              revertLoading
            }
            onClick={handleRevertList}
          />
        ) : null}
      </header>

      {rows?.length ? (
        <>
          <TextField
            select
            value={selectedRecordIndex}
            label="Select List"
            onChange={handleChangeList}
            variant="outlined"
            disabled={revertLoading}
          >
            {lists.map((list, ind) => (
              <MenuItem key={list.createdAt} value={ind} selected={ind === 0}>
                {' '}
                {formatDateTime(list.createdAt)}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2} mb={2} className={classes.listTitleWrapper}>
            <IconButton
              fontSize="medium"
              onClick={() => changeListNo(-1)}
              disabled={selectedListIndex === 0 || revertLoading}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography component="span" align="center" className={classes.listTitle}>
              {`${selectedListIndex + 1} / ${selectedRecord.list.length}`}
            </Typography>
            <IconButton
              fontSize="medium"
              onClick={() => changeListNo(1)}
              disabled={selectedListIndex === selectedRecord?.list?.length - 1 || revertLoading}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
          <CustomTable rows={rows || []} columns={columns} />

          <Grid container>
            <Grid item xs={12} sm={6}>
              <Box mt={2} mb={1}>
                <div className={classes.row}>
                  {' '}
                  <b>Total Amount : &nbsp; </b>
                  <span> {selectedList?.totalAmount} </span>
                </div>
                <div className={classes.row}>
                  {' '}
                  <b> Number of Accounts :&nbsp; </b>
                  <span>
                    {selectedList?.accounts?.length}&nbsp; {'   '}
                  </span>
                  <IconButton color="primary" onClick={copyToClipboard}>
                    <FileCopyIcon />
                  </IconButton>
                </div>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              container
              direction="column"
              alignItems="flex-end"
              justifyContent="center"
              className={classes.gridItem}
            >
              {' '}
              {['Failed', 'Aborted'].includes(taskStats?.status) ? (
                <>
                  <div className={classes.row}>
                    {taskStats?.status === 'Failed' ? (
                      <CancelIcon color="error" size="small" />
                    ) : (
                      <WarningIcon color="error" size="small" />
                    )}
                    &nbsp;{' '}
                    <Typography color="error" variant="subtitle1">
                      {' '}
                      <b> {taskStats?.status}</b>
                    </Typography>
                  </div>
                  <div className={classes.row}>
                    <Typography variant="caption" color="error" align="center">
                      {' '}
                      {formatErrorMessage(taskStats.error)}
                    </Typography>
                  </div>
                  <div className={classes.row}>
                    <Typography variant="caption" align="center">
                      {' '}
                      {taskStats.progress}
                    </Typography>
                  </div>
                </>
              ) : taskStats?.status === 'Done' ? (
                <>
                  <div className={classes.row}>
                    <CheckCircleIcon classes={{ root: classes.greenText }} size="small" /> &nbsp;{' '}
                    <Typography classes={{ root: classes.greenText }} variant="subtitle1">
                      {' '}
                      <b>
                        {' '}
                        {`Completed in ${calcTime(
                          taskStats.updatedAt,
                          taskStats.createdAt
                        )}!`}{' '}
                      </b>
                    </Typography>
                  </div>
                  <div className={classes.row}>
                    <Typography variant="caption" classes={{ root: classes.greenText }}>
                      {' '}
                      {taskStats.misc[selectedListIndex]}
                    </Typography>
                  </div>
                </>
              ) : ['Running', 'Initiated'].includes(taskStats?.status) ? (
                <>
                  <div className={classes.row}>
                    <RunningSvg width="2.5em" height="2.5em" color="success" size="small" /> &nbsp;{' '}
                    <Typography classes={{ root: classes.greenText }} variant="subtitle1">
                      {' '}
                      <b> Running!</b>
                    </Typography>
                  </div>
                  <div className={classes.row}>
                    <Typography variant="caption" classes={{ root: classes.lightGreenText }}>
                      {' '}
                      {taskStats.progress}
                    </Typography>
                  </div>
                </>
              ) : null}
            </Grid>
            <Grid item xs={12} container justifyContent="center" alignItems="center">
              {['Running'].includes(taskStats?.status) ? (
                <Controls.Button
                  text="Abort It!"
                  onClick={handleAbortListGeneration}
                  style={{ background: 'red' }}
                />
              ) : (
                <>
                  <TextField
                    select
                    value={timeout}
                    label="Timeout"
                    onChange={handleChangeTimeout}
                    variant="outlined"
                    fullWidth={false}
                  >
                    {timeoutArray.map((elem, ind) => (
                      <MenuItem key={elem.timeout} value={elem.timeout} selected={ind === 0}>
                        {' '}
                        {elem.text}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Controls.Button
                    text="Generate All lists"
                    onClick={handleGenerateList}
                    disabled={
                      (selectedRecord?.taskId && !taskStats) ||
                      ['Done', 'Initiated'].includes(taskStats?.status) ||
                      isLoading ||
                      revertLoading
                    }
                  />
                </>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="h6" align="center">
          ***No List Found***
        </Typography>
      )}
    </Paper>
  );
}
