import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { mutate } from 'swr';

import { useForm, Form } from '../common/useForm';
import Controls from '../common/controls/Controls';
import { triggerAlert } from '../services/getAlert/getAlert';
import accountTypeList from '../assets/data/accountType';
import { axiosUtil } from '../services/axiosinstance';
import { formatDate } from '../services/utils';
import { addAccountStyles } from '../styles/components/addAcount';
import handleError from '../services/handleError';
import { useAuth } from '../services/Auth';

const curDate = new Date();
const y = curDate.getFullYear();
const m = curDate.getMonth() + 1;
const d = curDate.getDate();
const initialValues = {
  name: '',
  accountNo: '',
  accountType: 'RD',
  amount: '',
  openingDate: `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`,
  maturityDate: `${y + 5}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`,
  mobile: '',
};
const convertDate = date =>
  `${date.split('-')[0]}-${date.split('-')[1]}-${date.split('-')[2][0]}${date.split('-')[2][1]}`;
function AddAccount({ setOpenPopup, recordForEdit }) {
  const classes = addAccountStyles();
  const { user, client, fetchAllAccounts } = useAuth();
  const [loading, setLoading] = useState(false);
  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name ? '' : 'Name is required';
    if ('accountNo' in fieldValues)
      temp.accountNo =
        fieldValues.accountNo.length === 12 || fieldValues.accountNo.length === 10
          ? ''
          : 'Incorrect Account Number';
    if ('amount' in fieldValues)
      temp.amount = Number.isInteger(+fieldValues.amount) ? '' : 'Incorrect Amount';
    if ('mobile' in fieldValues)
      temp.mobile = Number.isInteger(+fieldValues.mobile) ? '' : 'Confirm Mobile Number.';

    setErrors({ ...temp });
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    true,
    validate
  );

  useEffect(() => {
    if (recordForEdit) {
      setValues(() => ({
        ...recordForEdit,
        openingDate: formatDate(recordForEdit.openingDate),
        maturityDate: formatDate(recordForEdit.maturityDate),
      }));
    }
  }, [setValues, recordForEdit]);

  const handleAddAccount = async event => {
    event.preventDefault();
    // const endpoint = recordForEdit ? `editaccount` : `addaccount`;
    // setLoading(true);
    // axiosUtil[recordForEdit ? 'put' : 'post'](endpoint, values)
    //   .then(res => {
    //     triggerAlert({ icon: 'success', title: res.data });
    //     setOpenPopup(false);
    //     mutate(`allaccounts`);
    //   })
    //   .finally(() => setLoading(false));
    try {
      setLoading(true);
      const collection = await client.db('poaa').collection('accounts');
      console.log(d, typeof d);
      await collection.updateOne(
        { accountNo: values.accountNo },
        {
          $set: {
            ...values,
            amount: +values.amount,
            openingDate: new Date(values.openingDate),
            maturityDate: new Date(values.maturityDate),
            agentId1: user.id,
          },
        },
        { upsert: true }
      );
      triggerAlert({ icon: 'success', title: 'Account Saved!' });
      setOpenPopup(false);
      fetchAllAccounts();
    } catch (error) {
      handleError(error, triggerAlert);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleAddAccount} className={classes.root}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Controls.Input
            label="Name"
            name="name"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />
          <Controls.Input
            label="Account Number"
            name="accountNo"
            disabled={recordForEdit}
            value={values.accountNo}
            onChange={handleInputChange}
            required
            error={errors.accountNo}
          />
          <Controls.Input
            label="Opening Date"
            name="openingDate"
            type="date"
            value={values.openingDate}
            onChange={handleInputChange}
            required
            error={errors.openingDate}
          />
          <Controls.Select
            label="Type"
            name="accountType"
            value={values.accountType}
            onChange={handleInputChange}
            options={accountTypeList}
            required
            error={errors.accountType}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            label="Amount"
            name="amount"
            value={values.amount}
            onChange={handleInputChange}
            required
            error={errors.amount}
          />
          <Controls.Input
            label="Phone"
            name="phone"
            value={values.phone}
            onChange={handleInputChange}
            error={errors.phone}
          />
          <Controls.Input
            label="Maturity Date"
            name="maturityDate"
            type="date"
            value={values.maturityDate}
            onChange={handleInputChange}
            required
            error={errors.maturityDate}
          />
          <Controls.Button
            type="submit"
            text={recordForEdit ? `Edit Account` : 'Add Account'}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Form>
  );
}

export default AddAccount;
