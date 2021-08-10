import {
  Box,
  InputAdornment,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

import AddAccount from './AddAccount';
import Controls from '../common/controls/Controls';
import Popup from '../common/Popup';
import { useAuth } from '../services/Auth';
import useTable from '../common/useTable';
import { statisticListStyles } from '../styles/components/statisticList';

function StatisticList() {
  const classes = statisticListStyles();
  const [accounts, setAccounts] = useState([]);
  const [searchValue, changeSearchValue] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const { statsData } = useAuth();
  useEffect(() => {
    if (statsData) {
      const filterAccounts = statsData.filter(account => {
        return account.name && account.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      setAccounts(filterAccounts);
    }
  }, [statsData, searchValue]);

  const headCells = [
    { id: 'index', label: 'Sno' },
    { id: 'name', label: 'Name' },
    { id: 'accountno', label: 'AccountNo' },
    { id: 'accountType', label: 'Type' },
    { id: 'amount', label: 'Amount' },
    { id: 'Opening', label: 'Opening Date' },
    { id: 'maturityDate', label: 'Maturity Date' },
    { id: 'mobile', label: 'Mobile' },
  ];
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    accounts,
    headCells
  );
  if (!statsData) return <p> Loading</p>;

  const convertDate = date => {
    return date?.split('-')?.length >= 2
      ? `${date.split('-')[2][0]}${date.split('-')[2][1]}-${date.split('-')[1]}-${
          date.split('-')[0]
        }`
      : null;
  };
  return (
    <Box className={classes.root}>
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={event => changeSearchValue(event.target.value)}
          />
          {/* <TextField 
                        variant ="outlined"
                        label="Search"
                        name="search"
                        value={searchValue}
                        onChange={event=>changeSearchValue(event.target.value)}
                        InputProps={{
                            startAdorment:(<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                    /> */}
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((account, index) => (
              <TableRow key={index}>
                <TableCell> {index + 1}</TableCell>
                <TableCell> {account.name}</TableCell>
                <TableCell> {account.accountno}</TableCell>
                <TableCell> {account.accountType}</TableCell>
                <TableCell> {account.amount}</TableCell>
                <TableCell> {convertDate(account.openingDate?.toString())}</TableCell>
                <TableCell> {convertDate(account.maturityDate?.toString())}</TableCell>
                <TableCell> {account.mobile}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Account">
        <AddAccount setOpenPopup={setOpenPopup} />
      </Popup>
    </Box>
  );
}

export default StatisticList;
