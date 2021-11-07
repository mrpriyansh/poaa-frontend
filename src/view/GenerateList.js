import { Paper, IconButton, Typography, Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../services/Auth';
import handleError from '../services/handleError';
import {
  INSTALLMENT_LOGGED,
  LIST_CREATED,
  INSTALLMENT_PENDING,
  LIST_LIMIT,
} from '../services/constants';

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
  }, []);

  // if (error) return <Offline />;
  if (!installments) return <LoaderSVG />;

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
  const handleDelete = async item => {
    // axiosUtil.delete('/deleteInstallment', { data: { accountno: item.accountno } }).then(res => {
    // triggerAlert({ icon: 'success', title: res.data });
    // mutate('getAllInstallments');
    // });
    try {
      const collection = await client.db('poaa').collection('installments');
      await collection.deleteOne({ accountno: item.accountno });
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
            agentId1: user.id,
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
      console.log(installments);
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
    // const session = await Installment.startSession();
    // session.startTransaction();
    // try {
    //   if (installments.length === 0) {
    //     throw new Error('No installments found');
    //   }
    //   const list = [];
    //   let cur = 0;
    //   let listNo = 0;
    //   installments.forEach(inst => {
    //     let remaining = inst.total;
    //     let currentInst = inst.installments;
    //     while (remaining > 0) {
    //       if (cur < inst.amount) {
    //         listNo += 1;
    //         cur = LIST_LIMIT;
    //       }
    //       const payableInst = Math.min(Math.floor(cur / inst.amount), currentInst);
    //       if (list.length < listNo) {
    //         list.push({ accounts: [], totalAmount: 0, count: 0 });
    //       }
    //       list[listNo - 1].accounts.push({
    //         paidInstallments: payableInst,
    //         accountno: inst.accountno,
    //         name: inst.name,
    //         amount: inst.amount,
    //         totalAmount: inst.amount * payableInst,
    //       });
    //       list[listNo - 1].totalAmount += inst.amount * payableInst;
    //       list[listNo - 1].count += 1;
    //       cur -= payableInst * inst.amount;
    //       remaining -= payableInst * inst.amount;
    //       currentInst -= payableInst;
    //     }
    //   });
    //   await Installment.updateMany(
    //     {
    //       status: INSTALLMENT_PENDING,
    //       agentId1: user.id,
    //     },
    //     { status: INSTALLMENT_LIST_CREATED }
    //   ).session(session);
    //   const List = client.db('poaa').collection('lists');
    //   await List.create([{ list }], { session });
    //   await session.commitTransaction();
    //   triggerAlert({ icon: 'success', title: 'List Generated!' });
    // } catch (err) {
    //   await session.abortTransaction();
    //   handleError(err);
    // } finally {
    //   session.endSessien();
    // }
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
        pagination
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
