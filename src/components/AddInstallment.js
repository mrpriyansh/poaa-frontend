import React, { useEffect, useState, useCallback } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';

import Control from '../common/controls/Controls';
import { Form } from '../common/useForm';
import { addInstallmentsStyles } from '../styles/components/addInstallments';
import { triggerAlert } from '../services/getAlert/getAlert';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { useAuth } from '../services/Auth';
import { INSTALLMENT_PENDING } from '../services/constants';
import handleError from '../services/handleError';
import { isNull } from '../services/utils';

const initialValues = {
  name: '',
  accountNo: '',
  amount: '',
  installments: 1,
};

export default function AddInstallment({ setOpenPopup, isModifying, record }) {
  const classes = addInstallmentsStyles();
  const history = useHistory();
  const [rdAccounts, setRdAccounts] = useState();
  const [inputText, setInputText] = React.useState('');
  const [inputValue, setInputValue] = React.useState({ ...initialValues });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const { client, user, fetchInstallments } = useAuth();

  // const { data, error } = useSWR('allaccounts', axiosUtil.get);

  const fetchRDAccounts = useCallback(async () => {
    try {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - 1);

      const collection = await client.db('poaa').collection('accounts');
      const data = await collection.aggregate([
        { $match: { accountType: 'RD', maturityDate: { $gt: new Date(todaysDate) } } },
        { $sort: { name: 1 } },
      ]);
      setRdAccounts(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }, [client]);

  useEffect(() => {
    fetchRDAccounts();
  }, [fetchRDAccounts]);

  useEffect(() => {
    if (isModifying) setInputValue(record);
  }, [isModifying, record]);

  const handleChangeInstallments = e => {
    const { value } = e.target;
    const errorMessage = value > 0 ? '' : 'Invalid Installments Number';
    setErrors({ installments: errorMessage });
    setInputValue(prevState => ({ ...prevState, installments: +value }));
  };
  const handleChangeInputText = value => {
    const errorMessage = value ? '' : 'Name is required';
    setErrors({ name: errorMessage });
    setInputText(value);
  };

  const handleAddInstallment = async () => {
    if (errors.installments || errors.name) return;
    const fields = ['name', 'accountNo', 'amount'];
    if (isNull(inputValue, fields)) return;
    if (inputValue.installments <= 0) return;
    setIsLoading(true);

    try {
      const collection = await client.db('poaa').collection('installments');
      if (!isModifying) {
        const exists = await collection.findOne({
          accountNo: inputValue.accountNo,
          status: INSTALLMENT_PENDING,
        });
        if (exists) throw new Error('Accoun already logged, Try to edit it!');
      }
      await collection.updateOne(
        { accountNo: inputValue.accountNo },
        {
          $set: {
            ...inputValue,
            status: INSTALLMENT_PENDING,
            agentId1: user.id,
            createdAt: new Date(Date.now()),
          },
        },
        { upsert: true }
      );
      triggerAlert({ icon: 'success', title: 'Installment Saved!' });
      setOpenPopup(false);
      history.push('/generate-list');
      setInputValue({ ...initialValues });
      fetchInstallments();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      handleError(err, triggerAlert);
    } finally {
      setIsLoading(false);
    }
  };

  // if () return <Offline />;
  if (!rdAccounts) return <LoaderSVG />;
  return (
    <Form onSubmit={handleAddInstallment} className={classes.root}>
      <Grid container justifyContent="center">
        <Autocomplete
          value={inputValue}
          className={classes.autoCompleteRoot}
          fullWidth
          disabled={isModifying || isLoading}
          onChange={(_, newValue) => {
            if (newValue) setInputValue(newValue);
            else setInputValue({ ...initialValues });
          }}
          inputValue={inputText}
          onInputChange={(_, newInputValue) => {
            handleChangeInputText(newInputValue);
          }}
          options={rdAccounts
            // .filter(item => item.accountType === 'RD')
            .map(option => ({
              name: option.name,
              installments: 1,
              amount: option.amount,
              accountNo: option.accountNo,
            }))}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField
              name="name"
              {...params}
              label="Name"
              required
              variant="outlined"
              {...(errors.name && { error: true, helperText: errors.name })}
            />
          )}
          renderOption={option => {
            return (
              <div>
                <span style={{ fontSize: '0.85em', fontWeight: '700' }}>
                  {option.name} {'  '}
                </span>
                <span style={{ fontSize: '0.85em', color: 'green' }}>{option.amount}</span>
              </div>
            );
          }}
        />
        <TextField
          label="Amount"
          value={inputValue.amount}
          variant="outlined"
          fullWidth
          disabled={isModifying || isLoading}
        />
        <TextField
          label="Account No"
          value={inputValue.accountNo}
          variant="outlined"
          fullWidth
          disabled={isModifying || isLoading}
        />
        <TextField
          label="Installments"
          type="number"
          disabled={isLoading}
          inputProps={{ min: 1 }}
          value={inputValue.installments}
          onChange={handleChangeInstallments}
          variant="outlined"
          fullWidth
          required
          {...(errors.installments && { error: true, helperText: errors.installments })}
        />
        <Control.Button
          text="Save"
          onClick={handleAddInstallment}
          classes={{ root: classes.saveButton }}
          disabled={isLoading}
        />
      </Grid>
    </Form>
  );
}
