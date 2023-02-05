import { Paper, IconButton, Typography, Box } from '@material-ui/core';
import React, { useEffect, useState, lazy } from 'react';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PostAddIcon from '@material-ui/icons/PostAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom';

import CustomTable from '../common/Table';
import { formatDate } from '../services/utils';
import { generateListStyles } from '../styles/view/generateList';
import Controls from '../common/controls/Controls';
import { triggerAlert } from '../services/getAlert/getAlert';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { useAuth } from '../services/Auth';
import handleError from '../services/handleError';
import {
  INSTALLMENT_LOGGED,
  LIST_CREATED,
  INSTALLMENT_PENDING,
  LIST_LIMIT,
} from '../services/constants';

const Popup = lazy(() => import('../common/Popup'));
const AddInstallment = lazy(() => import('../components/AddInstallment'));

const EDIT_INSTALLMENT = 'Edit Installment';
const ADD_INSTALLMENT = 'Add Installment';
export default function GenerateList() {
  const history = useHistory();
  const classes = generateListStyles();
  const [openPopupType, setOpenPopupType] = useState('');
  const [currentRecord, setCurrentRecord] = useState({});
  const { client, user, fetchInstallments, installments } = useAuth();
  // const { data: response, error } = useSWR('getAllInstallments', axiosUtil.get);

  useEffect(() => {
    fetchInstallments();
  }, [fetchInstallments]);

  // if (error) return <Offline />;
  if (!installments) return <LoaderSVG />;

  const columns = [
    { id: 'name', label: 'Name', minWidth: '15em' },
    { id: 'amount', label: 'Amount', align: 'right' },
    { id: 'installments', label: 'Installments', align: 'center' },
    { id: 'accountNo', label: 'Account No', align: 'center', minWidth: '8em' },
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
  const handleDelete = async item => {
    // axiosUtil.delete('/deleteInstallment', { data: { accountNo: item.accountNo } }).then(res => {
    // triggerAlert({ icon: 'success', title: res.data });
    // mutate('getAllInstallments');
    // });
    try {
      const collection = await client.db('poaa').collection('installments');
      await collection.deleteOne({ accountNo: item.accountNo });
      triggerAlert({ icon: 'success', title: 'Installment deleted!' });
      fetchInstallments();
    } catch (err) {
      handleError(err, triggerAlert);
    }
  };

  const handleGenerateList = async () => {
    // axiosUtil.post('/generateList').then(res => {
    //   triggerAlert({ icon: 'success', title: res.data });
    //   history.push('/previous-lists');
    // });

    try {
      const Installment = client.db('poaa').collection('installments');
      const installments = await Installment.aggregate([
        {
          $match: {
            status: INSTALLMENT_PENDING,
            agentId: user.id,
          },
        },
        {
          $project: {
            status: 0,
          },
        },
        {
          $addFields: {
            total: {
              $multiply: ['$installments', '$amount'],
            },
          },
        },
        {
          $sort: {
            total: -1,
            amount: -1,
          },
        },
      ]);
      await user.functions.generateList(
        INSTALLMENT_PENDING,
        INSTALLMENT_LOGGED,
        LIST_CREATED,
        LIST_LIMIT,
        installments
      );
      triggerAlert({ icon: 'success', title: 'List Generated!' });
      history.push('/previous-lists');
    } catch (err) {
      handleError(err, triggerAlert);
    }
  };
  const rows = installments.map(inst => {
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
    installments.forEach(item => {
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
        // pagination
        emptyMessage="No Insatallments Found! Click Below to Add"
      />
      {rows.length ? (
        <Box mt={2} mb={2}>
          <div className={classes.row}>
            <b>Total Accounts : </b>
            <span> {installments.length} </span>
          </div>
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
