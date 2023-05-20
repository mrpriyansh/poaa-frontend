import React, { useState, Suspense, useMemo } from 'react';
import { Paper, Toolbar, InputAdornment, IconButton } from '@mui/material';
import Search from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { useDispatch } from 'react-redux';
import Controls from '../common/controls/Controls';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { deleteTrigger } from '../services/getAlert/getAlert';
import { allAccountStyles } from '../styles/view/accounts';
import { formatDateReverse, formatDate } from '../services/utils';

import CustomTable from '../common/Table';
import { axiosUtil } from '../services/axiosinstance';
import { ADD_INSTALLMENT, EDIT_ACCOUNT } from '../services/constants';
import { setPopup } from '../redux/popup';

function Home() {
  const classes = allAccountStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: response, mutate } = useSWR(`allaccounts`, axiosUtil.swr);

  const [searchValue, changeSearchValue] = useState('');
  const [searchType, changeSearchType] = useState('name');

  const searchTypeList = useMemo(
    () => [
      { title: t('pi.name'), value: 'name' },
      { title: t('account.number'), value: 'accountNumber' },
      { title: t('account.type'), value: 'accountType' },
      { title: t('account.maturity'), value: 'maturityDate' },
    ],
    [t]
  );

  const handleEdit = item => {
    dispatch(
      setPopup({ type: EDIT_ACCOUNT, title: t(EDIT_ACCOUNT), props: { recordForEdit: item } })
    );
  };

  const handleAddInstallment = () => {
    dispatch(setPopup({ type: ADD_INSTALLMENT, title: t(ADD_INSTALLMENT) }));
  };

  const filteredAccounts = useMemo(() => {
    return response?.filter(account => {
      if (searchType === 'name')
        return account.name.toLowerCase().includes(searchValue.toLowerCase());
      if (searchType === 'accountNumber') return account.accountNo?.includes(searchValue);
      if (searchType === 'accountType')
        return account.accountType.toLowerCase().includes(searchValue.toLowerCase());
      if (searchType === 'maturityDate')
        return formatDate(account.maturityDate)
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      return true;
    });
  }, [response, searchType, searchValue]);

  const handleDelete = async item => {
    deleteTrigger(mutate, item.accountNo);
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

  const rows = filteredAccounts?.map(acc => {
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

  if (!filteredAccounts) return <LoaderSVG />;

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
          <CustomTable rows={rows} columns={columns} pagination emptyMessage="No Account Found!" />
        </Paper>
      </Suspense>
    </>
  );
}

export default Home;
