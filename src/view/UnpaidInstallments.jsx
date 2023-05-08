import useSWR from 'swr';
import { axiosUtil } from '../services/axiosinstance';
import { Grid, InputAdornment, Paper, Typography } from '@mui/material';
import { t } from 'i18next';
import { useDeferredValue, useMemo, useState } from 'react';
import CustomTable from '../common/Table';
import { formatDateReverse } from '../services/utils';
import { unpaidInstallmentsStyles } from '../styles/view/unpaidInstallments';
import AddIcon from '@mui/icons-material/Add';
import Controls from '../common/controls/Controls';
import { Search } from '@mui/icons-material';

export default function() {
  const classes = unpaidInstallmentsStyles();
  const { data } = useSWR('unpaidInstallments', axiosUtil.swr);
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

  const rows = useMemo(
    () =>
      filteredAccounts?.map(inst => {
        return {
          name: inst.name,
          amount: inst.amount,
          accountNo: inst.accountNo,
          actions: (
            <Controls.Button
              size="small"
              text={t('installment.add')}
              variant="outlined"
              startIcon={<AddIcon />}
            />
          ),
        };
      }),
    [filteredAccounts]
  );
  return (
    <Paper className={classes.root}>
      <CustomTable
        rows={rows}
        columns={columns}
        emptyMessage={t('prompt.allPaid')}
        pagination
        defaultPageSize={20}
        paginationStartElement={
          <Grid container justifyContent="space-between" alignItems="center">
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
        }
      />
    </Paper>
  );
}
