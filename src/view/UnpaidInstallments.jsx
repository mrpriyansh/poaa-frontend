import useSWR from 'swr';
import { Grid, InputAdornment, Paper, Typography } from '@mui/material';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Search } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import CustomTable from '../common/Table';
import { unpaidInstallmentsStyles } from '../styles/view/unpaidInstallments';
import Controls from '../common/controls/Controls';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { axiosUtil } from '../services/axiosinstance';
import { setPopup } from '../redux/popup';
import { ADD_INSTALLMENT } from '../services/constants';

export default function UnpaidInstallments() {
  const classes = unpaidInstallmentsStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data, isLoading } = useSWR('unpaidInstallments', axiosUtil.swr);
  const [searchValue, setSearchValue] = useState('');
  const columns = useMemo(
    () => [
      { id: 'name', label: t('pi.name'), minWidth: '15em' },
      { id: 'accountNo', label: t('account.number'), align: 'center', minWidth: '8em' },
      { id: 'amount', label: t('account.amount'), align: 'right' },
      { id: 'actions', minWidth: '8em', align: 'center' },
    ],
    [t]
  );

  const deferredQuery = useDeferredValue(searchValue);

  const filteredAccounts = useMemo(() => {
    return data?.filter(account =>
      account.name.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [data, deferredQuery]);

  const handleAddInstallment = useCallback(
    account => {
      dispatch(
        setPopup({
          type: ADD_INSTALLMENT,
          title: t(ADD_INSTALLMENT),
          props: {
            record: {
              name: account.name,
              accountNo: account.accountNo,
              amount: account.amount,
              installments: 1,
            },
          },
        })
      );
    },
    [dispatch, t]
  );
  const rows = useMemo(
    () =>
      filteredAccounts?.map(inst => ({
        name: inst.name,
        amount: inst.amount,
        accountNo: inst.accountNo,
        actions: (
          <Controls.Button
            size="small"
            text={t('installment.add')}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddInstallment(inst)}
          />
        ),
      })),
    [filteredAccounts, handleAddInstallment, t]
  );

  if (isLoading) return <LoaderSVG />;
  return (
    <Paper className={classes.root}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={classes.headerWrapper}
      >
        <Grid item>
          <Typography variant="h5">{t('account.unpaid')}</Typography>
        </Grid>
        <Grid item>
          <Controls.Input
            label="Search"
            fullWidth={false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)}
          />
        </Grid>
      </Grid>
      <CustomTable
        rows={rows}
        columns={columns}
        emptyMessage={t('prompt.allPaid')}
        pagination
        defaultPageSize={20}
      />
    </Paper>
  );
}
