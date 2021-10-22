import React, { useState, useEffect } from 'react';
import { Paper, Toolbar, InputAdornment, IconButton } from '@material-ui/core';
import useSWR from 'swr';
import Search from '@material-ui/icons/Search';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PostAddIcon from '@material-ui/icons/PostAdd';

import Controls from '../common/controls/Controls';
import Popup from '../common/Popup';
import AddAccount from '../components/AddAccount';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { deleteTrigger } from '../services/getAlert/getAlert';
import { axiosUtil } from '../services/axiosinstance';
import { allAccountStyles } from '../styles/view/home';
import CustomTable from '../common/Table';
import { formatDate } from '../services/utils';
import Offline from './Offline';
import AddInstallment from '../components/AddInstallment';
import { useAuth } from '../services/Auth';

const searchTypeList = [
  { title: 'Name' },
  { title: 'Account Number' },
  { title: 'Account Type' },
  { title: 'Maturity Date' },
];

const EDIT_ACCOUNT = 'Edit Account';
const ADD_INSTALLMENT = 'Add Installment';

function Home() {
  const classes = allAccountStyles();
  const { client } = useAuth();

  const { data: response, error } = useSWR(`allaccounts`, axiosUtil.get);

  const [accounts, setAccounts] = useState([]);
  const [searchValue, changeSearchValue] = useState('');
  const [openPopupType, setOpenPopupType] = useState('');
  const [searchType, changeSearchType] = useState('Name');
  const [recordForEdit, setRecordForEdit] = useState();

  const fetchAllAccounts = async () => {
    const collection = await client.db('poaa').collection('accounts');
    const data = await collection.aggregate([{ $sort: { name: -1 } }]);
    setAccounts(data);
  };
  useEffect(() => {
    fetchAllAccounts();
  }, []);

  const handleEdit = item => {
    setRecordForEdit(item);
    setOpenPopupType(EDIT_ACCOUNT);
  };

  const handleAddInstallment = () => {
    setOpenPopupType(ADD_INSTALLMENT);
  };

  // useEffect(() => {
  //   if (response) {
  //     const filterAccounts = response.data.filter(account => {
  //       if (searchType === 'Name')
  //         return account.name.toLowerCase().includes(searchValue.toLowerCase());
  //       if (searchType === 'Account Number')
  //         return account.accountno?.toString().includes(searchValue);
  //       if (searchType === 'Account Type')
  //         return account.accountType.toLowerCase().includes(searchValue.toLowerCase());
  //       if (searchType === 'Maturity Date')
  //         return formatDate(account.maturityDate)
  //           .toLowerCase()
  //           .includes(searchValue.toLowerCase());
  //       return true;
  //     });
  //     // setAccounts(filterAccounts);
  //   }
  // }, [response, searchValue, searchType]);

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

  if (error) return <Offline />;
  if (!response) return <LoaderSVG />;

  return (
    <>
      <Paper className={classes.pageContent} m={6}>
        <Controls.Button
          text="Add Installment"
          startIcon={<PostAddIcon />}
          classes={{ root: classes.addInstButton }}
          onClick={handleAddInstallment}
        />
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
      <Popup
        openPopup={Boolean(openPopupType?.length)}
        setOpenPopup={setOpenPopupType}
        title={openPopupType}
      >
        {openPopupType === EDIT_ACCOUNT ? (
          <AddAccount setOpenPopup={setOpenPopupType} recordForEdit={recordForEdit} />
        ) : (
          <AddInstallment setOpenPopup={setOpenPopupType} />
        )}
      </Popup>
    </>
  );
}

export default Home;
