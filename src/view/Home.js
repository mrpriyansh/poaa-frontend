import React, { useState, useEffect } from 'react';
import { Paper, Toolbar, InputAdornment, IconButton } from '@material-ui/core';
import useSWR from 'swr';
import { Search } from '@material-ui/icons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Controls from '../common/controls/Controls';
import Popup from '../common/Popup';
import AddAccount from '../components/AddAccount';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { deleteTrigger } from '../services/getAlert/getAlert';
import { axiosUtil } from '../services/axiosinstance';
import { allAccountStyles } from '../styles/view/home';
import CustomTable from '../common/Table';
import { formatDate } from '../services/utils';

const searchTypeList = [
  { title: 'Name' },
  { title: 'Account Number' },
  { title: 'Account Type' },
  { title: 'Maturity Date' },
];

function Home() {
  const classes = allAccountStyles();

  const { data: response, error } = useSWR(`allaccounts`, axiosUtil.get);

  const [accounts, setAccounts] = useState([]);
  const [searchValue, changeSearchValue] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [searchType, changeSearchType] = useState('Name');
  const [recordForEdit, setRecordForEdit] = useState();

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
          return formatDate(account.maturityDate)
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        return true;
      });
      setAccounts(filterAccounts);
    }
  }, [response, searchValue, searchType]);

  const handleDelete = item => {
    deleteTrigger(item.accountno);
  };

  const createData = (name, accountno, accountType, amount, opening, maturityDate, actions) => {
    return { name, accountno, accountType, amount, opening, maturityDate, actions };
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: '15em' },
    { id: 'amount', label: 'Amount', align: 'center' },
    { id: 'accountType', label: 'Type', align: 'center' },
    { id: 'accountno', label: 'Account No.', align: 'center', minWidth: '8em' },
    { id: 'opening', label: 'Opening Date', align: 'center', minWidth: '9em' },
    { id: 'maturityDate', label: 'Maturity Date', align: 'center', minWidth: '9em' },
    { id: 'actions', align: 'center', minWidth: '8em' },
  ];

  const rows = accounts.map(acc => {
    return createData(
      acc.name,
      acc.accountno,
      acc.accountType,
      acc.amount,
      formatDate(acc.openingDate),
      formatDate(acc.maturityDate),
      <>
        <IconButton onClick={() => handleEdit(acc)}>
          {' '}
          <EditOutlinedIcon />{' '}
        </IconButton>{' '}
        <IconButton onClick={() => handleDelete(acc)}>
          <DeleteForeverIcon color="error" />
        </IconButton>{' '}
      </>
    );
  });

  if (error) return <p style={{ color: 'red' }}> Error in Fetching</p>;
  if (!response) return <LoaderSVG />;

  return (
    <>
      <Paper className={classes.pageContent} m={6}>
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
        </Toolbar>
        <CustomTable rows={rows} columns={columns} pagination />
      </Paper>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} title="Add Account">
        <AddAccount setOpenPopup={setOpenPopup} recordForEdit={recordForEdit} />
      </Popup>
    </>
  );
}

export default Home;