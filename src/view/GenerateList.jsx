import { Paper, IconButton, Typography, Box } from '@material-ui/core';
import React, { useState, lazy, useMemo } from 'react';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSWR, { useSWRConfig } from 'swr';

import CustomTable from '../common/Table';
import { formatDateReverse } from '../services/utils';
import { generateListStyles } from '../styles/view/generateList';
import Controls from '../common/controls/Controls';
import { triggerAlert } from '../services/getAlert/getAlert';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { axiosUtil } from '../services/axiosinstance';

const Popup = lazy(() => import('../common/Popup'));
const AddInstallment = lazy(() => import('../components/AddInstallment'));

export default function GenerateList() {
  const classes = generateListStyles();
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const history = useHistory();
  const [openPopupType, setOpenPopupType] = useState('');
  const [currentRecord, setCurrentRecord] = useState({});
  const { data: response } = useSWR('getAllInstallments', axiosUtil.swr);

  const EDIT_INSTALLMENT = useMemo(() => t('installment.edit'), [t]);
  const ADD_INSTALLMENT = useMemo(() => t('installment.add'), [t]);
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
    setCurrentRecord(item);
    setOpenPopupType(EDIT_INSTALLMENT);
  };
  const handleAddInstallment = () => {
    setOpenPopupType(ADD_INSTALLMENT);
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
      <Popup
        setOpenPopup={setOpenPopupType}
        openPopup={Boolean(openPopupType?.length)}
        title={openPopupType}
      >
        <AddInstallment
          setOpenPopup={setOpenPopupType}
          isModifying={openPopupType === EDIT_INSTALLMENT}
          record={currentRecord}
        />
      </Popup>
    </Paper>
  );
}
