import { Box, IconButton, MenuItem, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningIcon from '@mui/icons-material/Warning';
import copy from 'copy-to-clipboard';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { ReactComponent as RunningSvg } from '../assets/icons/running.svg';
import { axiosUtil } from '../services/axiosinstance';
import { formatDateTime } from '../services/utils';
import CustomTable from '../common/Table';
import { previousListsStyles } from '../styles/view/previousLists';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import Controls from '../common/controls/Controls';
import config from '../services/config';
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [timeout, setTimeout] = useState(60000);
  const [revertLoading, setRevertLoading] = useState(false);

  const history = useHistory();

  const { data: response, isLoading: dataLoading } = useSWR('getAllLists', axiosUtil.get);

  const formatErrorMessage = message => {
    const regexTemp = /(waiting for) .*/;
    const match = message?.match(regexTemp);
    if (match?.length >= 2 && match[1] === 'waiting for')
      return 'DOP server was slow. Please try again!';

    return message;
  };

  const selectedRecord = response?.data?.length > 0 ? response?.data?.[selectedRecordIndex] : {};
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

  const columns = useMemo(
    () => [
      { id: 'name', label: t('pi.name'), minWidth: '15em' },
      { id: 'paidInstallments', label: t('installment.number'), align: 'center' },
      { id: 'amount', label: t('account.amount'), align: 'right' },
      { id: 'totalAmount', label: t('total.amount'), minWidth: '10em', align: 'right' },
      { id: 'accountNo', label: t('account.number'), minWidth: '8em', align: 'center' },
    ],
    [t]
  );

  const timeoutArray = [
    { timeout: 30000, text: 'DoP is very fast.' },
    { timeout: 45000, text: 'DoP is fast.' },
    { timeout: 60000, text: 'DoP is ok.' },
    { timeout: 75000, text: 'DoP is slow.' },
    { timeout: 90000, text: 'DoP is very slow.' },
  ];

  if (dataLoading) return <LoaderSVG />;

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
        const updatedData = response?.data?.map(ele => {
          if (ele._id === selectedRecord._id) return { ...ele, taskId: res.data.taskId };
          return ele;
        });
        response.data = [...updatedData];
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRevertList = async e => {
    e.preventDefault();
    try {
      setRevertLoading(true);
      await axiosUtil.delete(`/revertList/${selectedRecord._id}`, {
        listId: selectedRecord._id,
      });

      history.push('/create-list');
    } finally {
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
    const timeDiff = (new Date(t1) - new Date(t2)) / 1000;
    const minutes = timeDiff / 60;
    const seconds = timeDiff % 60;
    return `${minutes.toFixed(0)} min ${seconds.toFixed(0)} sec `;
  };

  return (
    <Paper classes={{ root: classes.root }}>
      <header className={classes.headerWrapper}>
        <Typography variant="h5" className={classes.heading}>
          {t('list.all')}
        </Typography>
        {response?.data?.length ? (
          <Controls.Button
            text={t('list.edit')}
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
            label={t('list.select')}
            onChange={handleChangeList}
            variant="outlined"
            disabled={revertLoading}
          >
            {response?.data?.map((list, ind) => (
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
                  <b>{t('total.amount')}: &nbsp; </b>
                  <span> {selectedList?.totalAmount} </span>
                </div>
                <div className={classes.row}>
                  {' '}
                  <b> {t('total.accounts')}:&nbsp; </b>
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
                    {taskStats.misc[selectedListIndex].url ? (
                      <a href={taskStats.misc[selectedListIndex].url} target="_blank" download>
                        <IconButton
                          color="success"
                          onClick={() => {
                            console.log('fdsa', taskStats.misc[selectedListIndex].url);
                            taskStats.misc[selectedListIndex].url;
                          }}
                        >
                          <ArrowCircleDownIcon />
                        </IconButton>
                      </a>
                    ) : null}
                    <Typography variant="caption" classes={{ root: classes.greenText }}>
                      {' '}
                      {taskStats.misc[selectedListIndex].refNo}
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
                    text={t('operation.generateRefNo')}
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
