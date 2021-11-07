import { Box, IconButton, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import copy from 'copy-to-clipboard';

import { axiosUtil } from '../services/axiosinstance';
import { formatDateTime } from '../services/utils';
import CustomTable from '../common/Table';
import { previousListsStyles } from '../styles/view/previousLists';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import Offline from './Offline';
import { useAuth } from '../services/Auth';

export default function PreviousList() {
  const classes = previousListsStyles();
  // const { data: response, error } = useSWR('/getAllLists', axiosUtil.get);
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [selectedList, setSelectedList] = useState({});
  const [lists, setLists] = useState();
  const { client } = useAuth();

  const fetchList = async () => {
    const collection = await client.db('poaa').collection('lists');
    const data = await collection.aggregate([{ $sort: { _id: -1 } }, { $limit: 2 }]);
    setLists(data);
  };
  useEffect(() => {
    fetchList();
  }, []);
  useEffect(() => {
    if (lists?.length > 0) {
      setSelectedRecord(lists[0]);
      setSelectedList(lists[0].list[0]);
      setSelectedListIndex(0);
    }
  }, [lists]);

  const handleChangeList = e => {
    const { value } = e.target;
    setSelectedRecord(value);
    setSelectedListIndex(0);
    setSelectedList(value.list[0]);
  };

  const copyToClipboard = () => {
    copy(selectedList.accounts.map(record => record.accountNo).toString());
  };

  const changeListNo = change => {
    setSelectedList(selectedRecord.list[selectedListIndex + change]);
    setSelectedListIndex(prevState => prevState + change);
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: '15em' },
    { id: 'paidInstallments', label: 'Installments', align: 'center' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'totalAmount', label: 'Total Amount', minWidth: '10em', align: 'right' },
    { id: 'accountNo', label: 'Account No.', minWidth: '8em', align: 'center' },
  ];

  // if (error) return <Offline />;
  if (!lists) return <LoaderSVG />;

  const rows = selectedList?.accounts
    ?.sort((a, b) => {
      return b.paidInstallments - a.paidInstallments;
    })
    .map(acc => acc);
  return (
    <Paper classes={{ root: classes.root }}>
      <Typography variant="h5" className={classes.heading}>
        Previous Lists
      </Typography>

      {rows?.length ? (
        <>
          <TextField
            select
            value={selectedRecord}
            label="Select List"
            onChange={handleChangeList}
            variant="outlined"
          >
            {lists.map((list, ind) => (
              <MenuItem key={list.createdAt} value={list} selected={ind === 0}>
                {' '}
                {formatDateTime(list.createdAt)}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2} mb={2} className={classes.listTitleWrapper}>
            <IconButton
              fontSize="medium"
              onClick={() => changeListNo(-1)}
              disabled={selectedListIndex === 0}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography component="span" align="center" className={classes.listTitle}>
              {`${selectedListIndex + 1} / ${selectedRecord.list.length}`}
            </Typography>
            <IconButton
              fontSize="medium"
              onClick={() => changeListNo(1)}
              disabled={selectedListIndex === selectedRecord?.list?.length - 1}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
          <CustomTable rows={rows || []} columns={columns} />

          <Box mt={2} mb={2}>
            <div className={classes.row}>
              {' '}
              <b>Total Amount : </b>
              <span> {selectedList?.totalAmount} </span>
              {/* <span>{selectedRecord.list[selectedListIndex].totalAmount}</span> */}
            </div>
            <div className={classes.row}>
              {' '}
              <b> Number of Accounts : </b>
              <span>
                {selectedList?.accounts?.length} {'   '}
              </span>
              <IconButton color="primary" onClick={copyToClipboard}>
                <FileCopyIcon />
              </IconButton>
            </div>
          </Box>
        </>
      ) : (
        <Typography variant="h6" align="center">
          ***No List Found***
        </Typography>
      )}
    </Paper>
  );
}
