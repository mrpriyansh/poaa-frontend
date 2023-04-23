import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import {
  Paper,
  Toolbar,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useTranslation } from 'react-i18next';

import Controls from '../common/controls/Controls';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { deleteTrigger } from '../services/getAlert/getAlert';
import { allAccountStyles } from '../styles/view/home';
import { formatDateReverse, formatDate } from '../services/utils';
import { useAuth } from '../services/Auth';

import CustomTable from '../common/Table';

const AddInstallment = lazy(() => import('../components/AddInstallment'));
const AddAccount = lazy(() => import('../components/AddAccount'));
const Popup = lazy(() => import('../common/Popup'));

const EDIT_ACCOUNT = 'Edit Account';
const ADD_INSTALLMENT = 'Add Installment';

function Home({ maturityState, setMaturityState }) {
  const classes = allAccountStyles();
  const { t } = useTranslation();
  const { client, fetchAllAccounts, allAccounts } = useAuth();

  // const { data: response, error } = useSWR(`allaccounts`, axiosUtil.get);

  const [accounts, setAccounts] = useState([]);
  const [searchValue, changeSearchValue] = useState('');
  const [openPopupType, setOpenPopupType] = useState('');
  const [searchType, changeSearchType] = useState(t('pi.name'));
  const [recordForEdit, setRecordForEdit] = useState();

  const searchTypeList = useMemo(
    () => [
      { title: t('pi.name') },
      { title: t('account.number') },
      { title: t('account.type') },
      { title: t('account.maturity') },
    ],
    [t]
  );
  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  const handleEdit = item => {
    setRecordForEdit(item);
    setOpenPopupType(EDIT_ACCOUNT);
  };

  const handleAddInstallment = () => {
    setOpenPopupType(ADD_INSTALLMENT);
  };

  const handleMaturityChange = (_, newValue) => {
    setMaturityState(newValue);
  };

  useEffect(() => {
    if (allAccounts?.length) {
      const filterAccounts = allAccounts.filter(account => {
        if (searchType === 'Name')
          return account.name.toLowerCase().includes(searchValue.toLowerCase());
        if (searchType === 'Account Number') return account.accountNo?.includes(searchValue);
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
  }, [allAccounts, searchValue, searchType]);

  const handleDelete = async item => {
    const collection = await client.db('poaa').collection('accounts');
    deleteTrigger(collection, fetchAllAccounts, item.accountNo);
  };

  const createData = (name, accountNo, accountType, amount, opening, maturityDate, actions) => {
    return { name, accountNo, accountType, amount, opening, maturityDate, actions };
  };

  const columns = useMemo(
    () => [
      { id: 'name', label: t('pi.name'), minWidth: '15em' },
      { id: 'amount', label: t('account.amount'), align: 'center' },
      { id: 'accountType', label: t('account.type'), align: 'center' },
      { id: 'accountNo', label: t('account.number'), align: 'center', minWidth: '8em' },
      { id: 'opening', label: t('account.open'), align: 'center', minWidth: '9em' },
      { id: 'maturityDate', label: t('account.maturity'), align: 'center', minWidth: '9em' },
      { id: 'actions', align: 'center', minWidth: '8em' },
    ],
    [t]
  );

  const rows = accounts.map(acc => {
    return createData(
      acc.name,
      acc.accountNo,
      acc.accountType,
      acc.amount,
      formatDateReverse(acc.openingDate),
      formatDateReverse(acc.maturityDate),
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

  // if (error) return <Offline />;
  if (!allAccounts) return <LoaderSVG />;

  return (
    <>
      <Suspense fallback={<LoaderSVG />}>
        <Paper className={classes.pageContent} m={6}>
          <Controls.Button
            text={t('installment.add')}
            startIcon={<PostAddIcon />}
            classes={{ root: classes.addInstButton }}
            onClick={handleAddInstallment}
          />
          <Toolbar classes={{ root: classes.toolbarRoot }}>
            <Controls.Select
              label={t('operation.searchOn')}
              name="accountType"
              value={searchType}
              onChange={event => changeSearchType(event.target.value)}
              options={searchTypeList}
              required
              classes={{ root: classes.typeField }}
            />
            <Controls.Input
              label={t('operation.search')}
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
          <CustomTable
            rows={rows}
            columns={columns}
            pagination
            paginationStartElement={
              <FormGroup row className={classes.maturityCheckboxWrapper}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={handleMaturityChange}
                      checked={maturityState}
                      style={{ color: 'black' }}
                    />
                  }
                  label="Only Maturity"
                />
              </FormGroup>
            }
          />
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
      </Suspense>
    </>
  );
}

export default Home;
