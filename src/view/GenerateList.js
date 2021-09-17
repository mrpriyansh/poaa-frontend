import { Paper, IconButton, Typography, Box } from '@material-ui/core';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom';

import CustomTable from '../common/Table';
import { axiosUtil } from '../services/axiosinstance';
import { formatDate } from '../services/utils';
import { generateListStyles } from '../styles/view/generateList';
import Controls from '../common/controls/Controls';
import { triggerAlert } from '../services/getAlert/getAlert';
import Popup from '../common/Popup';
import AddInstallment from '../components/AddInstallment';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import Offline from './Offline';

const EDIT_INSTALLMENT = 'Edit Installment';
const ADD_INSTALLMENT = 'Add Installment';
export default function GenerateList() {
  const history = useHistory();
  const classes = generateListStyles();
  const [openPopupType, setOpenPopupType] = useState('');
  const [currentRecord, setCurrentRecord] = useState({});
  const { data: response, error } = useSWR('getAllInstallments', axiosUtil.get);
  if (error) return <Offline />;
  if (!response) return <LoaderSVG />;

  const columns = [
    { id: 'name', label: 'Name', minWidth: '15em' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'installments', label: 'Installments', align: 'center' },
    { id: 'accountno', label: 'Account No', align: 'center', minWidth: '8em' },
    { id: 'createdAt', label: 'Logged On', minWidth: '8em', align: 'center' },
    { id: 'actions', minWidth: '8em' },
  ];

  const handleEdit = item => {
    setCurrentRecord(item);
    setOpenPopupType(EDIT_INSTALLMENT);
  };
  const handleAddInstallment = () => {
    setOpenPopupType(ADD_INSTALLMENT);
  };
  const handleDelete = item => {
    axiosUtil.delete('/deleteInstallment', { data: { accountno: item.accountno } }).then(res => {
      triggerAlert({ icon: 'success', title: res.data });
      mutate('getAllInstallments');
    });
  };

  const handleGenerateList = () => {
    axiosUtil.post('/generateList').then(res => {
      triggerAlert({ icon: 'success', title: res.data });
      history.push('/previous-lists');
    });
  };
  const rows = response.data.map(inst => {
    return {
      ...inst,
      createdAt: formatDate(inst.createdAt),
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
    response.data.forEach(item => {
      sum += item.amount * item.installments;
    });
    return sum;
  };
  return (
    <Paper className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h5">Logged Installments</Typography>
        {rows.length ? (
          <Controls.Button
            text="Add Installment"
            startIcon={<PostAddIcon />}
            onClick={handleAddInstallment}
          />
        ) : null}
      </header>
      <CustomTable
        rows={rows}
        columns={columns}
        pagination
        emptyMessage="No Insatallments Found! Click Below to Add"
      />
      {rows.length ? (
        <Box mt={2} mb={2}>
          <div className={classes.row}>
            <b>Total Amount : </b>
            <span> {totalAmount()} </span>
          </div>
        </Box>
      ) : null}
      <div className={classes.generateButtonWrapper}>
        {rows?.length ? (
          <Controls.Button
            text="Generate List"
            startIcon={<SettingsIcon />}
            onClick={handleGenerateList}
          />
        ) : (
          <Controls.Button
            text="Add Installment"
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
