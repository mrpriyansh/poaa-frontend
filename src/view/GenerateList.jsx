import { Paper, IconButton, Typography, Box } from '@mui/material';
import React, { useMemo } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSWR, { useSWRConfig, preload } from 'swr';

import { useDispatch } from 'react-redux';
import CustomTable from '../common/Table';
import { formatDateReverse } from '../services/utils';
import { generateListStyles } from '../styles/view/generateList';
import Controls from '../common/controls/Controls';
import { triggerAlert } from '../services/getAlert/getAlert';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { axiosUtil } from '../services/axiosinstance';
import { setPopup } from '../redux/popup';
import { ADD_INSTALLMENT, EDIT_INSTALLMENT } from '../services/constants';

export default function GenerateList() {
  const classes = generateListStyles();
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const dispatch = useDispatch();
  const history = useHistory();

  preload('allaccounts', axiosUtil.swr);
  const { data: response } = useSWR('getAllInstallments', axiosUtil.swr);

  const columns = useMemo(
    () => [
      { id: 'name', label: t('pi.name'), minWidth: '15em' },
      { id: 'amount', label: t('account.amount'), align: 'right' },
      { id: 'installments', label: t('installment.number'), align: 'center' },
      { id: 'accountNo', label: t('account.number'), align: 'center', minWidth: '8em' },
      { id: 'createdAt', label: t('installment.loggedOn'), minWidth: '8em', align: 'center' },
      { id: 'actions', minWidth: '8em' },
    ],
    [t]
  );

  const handleEdit = item => {
    dispatch(
      setPopup({
        type: EDIT_INSTALLMENT,
        title: t(EDIT_INSTALLMENT),
        props: {
          isModifying: true,
          record: item,
        },
      })
    );
  };
  const handleAddInstallment = () => {
    dispatch(setPopup({ type: ADD_INSTALLMENT, title: t(ADD_INSTALLMENT) }));
  };
  const handleDelete = async item => {
    axiosUtil.delete('/deleteInstallment', { data: { accountNo: item.accountNo } }).then(res => {
      triggerAlert({ icon: 'success', title: res.data });
      mutate('getAllInstallments');
    });
  };

  const handleGenerateList = async () => {
    axiosUtil.post('/generateList').then(res => {
      triggerAlert({ icon: 'success', title: res.data });
      history.push('/previous-lists');
    });
  };
  const rows = response?.map(inst => {
    return {
      ...inst,
      createdAt: formatDateReverse(inst.createdAt),
      actions: (
        <>
          <IconButton onClick={() => handleEdit(inst)}>
            {' '}
            <EditOutlinedIcon />{' '}
          </IconButton>{' '}
          <IconButton onClick={() => handleDelete(inst)}>
            <DeleteForeverIcon color="error" />
          </IconButton>{' '}
        </>
      ),
    };
  });
  const totalAmount = () => {
    let sum = 0;
    response?.forEach(item => {
      sum += item.amount * item.installments;
    });
    return sum;
  };

  // if (error) return <Offline />;
  if (!response) return <LoaderSVG />;
  return (
    <>
      <Helmet>
        <title> Generate List</title>
      </Helmet>
      <Paper className={classes.root}>
        <header className={classes.header}>
          <Typography variant="h5">{t('installment.logged')}</Typography>
          {rows.length ? (
            <Controls.Button
              text={t('installment.add')}
              startIcon={<PostAddIcon />}
              onClick={handleAddInstallment}
            />
          ) : null}
        </header>
        <CustomTable
          rows={rows}
          columns={columns}
          // pagination
          emptyMessage={t('operation.clickButtonOnZeroInstallment')}
        />
        {rows.length ? (
          <Box mt={2} mb={2}>
            <div className={classes.row}>
              <b>{t('total.accounts')} : </b>
              <span> {response?.length} </span>
            </div>
            <div className={classes.row}>
              <b>{t('total.amount')} : </b>
              <span> {totalAmount()} </span>
            </div>
          </Box>
        ) : null}
        <div className={classes.generateButtonWrapper}>
          {rows?.length ? (
            <Controls.Button
              text={t('list.create')}
              startIcon={<SettingsIcon />}
              onClick={handleGenerateList}
            />
          ) : (
            <Controls.Button
              text={t('installment.add')}
              startIcon={<PostAddIcon />}
              onClick={handleAddInstallment}
            />
          )}
        </div>
      </Paper>
    </>
  );
}
