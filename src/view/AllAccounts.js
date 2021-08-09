import React, { useState, useEffect } from 'react';
import { TableBody, TableRow, TableCell, Paper, Toolbar, InputAdornment } from '@material-ui/core';
import useSWR from 'swr';
import { Search } from '@material-ui/icons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';

import useTable from '../common/useTable';
import Controls from '../common/controls/Controls';
import Popup from '../common/Popup';
import AddAccount from './AddAccount';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { deleteTrigger } from '../services/getAlert/getAlert';
import { axiosUtil } from '../services/axiosinstance';
import { allAccountStyles } from '../styles/view/allAccounts';

function AllAccounts() {
  const classes = allAccountStyles();
  const { data: response, error } = useSWR(`allaccounts`, axiosUtil.get);

  const [accounts, setAccounts] = useState([]);
  const [searchValue, changeSearchValue] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [searchType, changeSearchType] = useState('Name');
  const [recordForEdit, setRecordForEdit] = useState();

  const convertDate = date =>
    `${date.split('-')[2][0]}${date.split('-')[2][1]}-${date.split('-')[1]}-${date.split('-')[0]}`;
  const handleEdit = item => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };
  useEffect(() => {
    if (response) {
      const filterAccounts = response.data.filter(account => {
        if (searchType === 'Name')
          return account.name.toLowerCase().includes(searchValue.toLowerCase());
        if (searchType === 'Account Number')
          return account.accountno?.toString().includes(searchValue);
        if (searchType === 'Account Type')
          return account.accountType.toLowerCase().includes(searchValue.toLowerCase());
        if (searchType === 'Maturity Date')
          return convertDate(account.maturityDate)
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        return true;
      });
      setAccounts(filterAccounts);
    }
  }, [response, searchValue, searchType]);

  const searchTypeList = [
    { title: 'Name' },
    { title: 'Account Number' },
    { title: 'Account Type' },
    { title: 'Maturity Date' },
  ];
  const headCells = [
    { id: 'index', label: 'Sno' },
    { id: 'name', label: 'Name' },
    { id: 'accountno', label: 'AccountNo' },
    { id: 'accountType', label: 'Type' },
    { id: 'amount', label: 'Amount' },
    { id: 'Opening', label: 'Opening Date' },
    { id: 'maturityDate', label: 'Maturity Date' },
    { id: 'actions', label: 'Actions' },
  ];
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useTable(
    accounts,
    headCells
  );
  if (error) return <p style={{ color: 'red' }}> Error in Fetching</p>;
  if (!response) return <LoaderSVG />;

  const handleDelete = item => {
    deleteTrigger(item.accountno);
  };
  return (
    // <Box className={classes.root}>
    <>
      <Paper className={classes.pageContent}>
        <Toolbar classes={{ root: classes.toolbarRoot }}>
          <Controls.Select
            label="Type"
            name="accountType"
            value={searchType}
            onChange={event => changeSearchType(event.target.value)}
            options={searchTypeList}
            required
            classes={{ root: classes.typeField }}
          />
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
          {/* <Controls.Button
            text="Add Account"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setRecordForEdit();
              setOpenPopup(true);
            }}
          /> */}
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
                <TableCell> {convertDate(account.openingDate)}</TableCell>
                <TableCell> {convertDate(account.maturityDate)}</TableCell>
                <TableCell>
                  <Controls.ActionButton color="primary" onClick={() => handleEdit(account)}>
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton color="secondary" onClick={() => handleDelete(account)}>
                    <CloseIcon fontSize="small" />
                  </Controls.ActionButton>
                </TableCell>
                {/* <TableCell> {account.mobile}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Account">
        <AddAccount setOpenPopup={setOpenPopup} recordForEdit={recordForEdit} />
      </Popup>
    </>
    // </Box>
  );
}

export default AllAccounts;
