import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useForm, Form } from '../common/useForm';
import Controls from '../common/controls/Controls';
import { triggerAlert } from '../services/getAlert/getAlert';
import accountTypeList from '../assets/data/accountType';
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
function AddAccount({ setOpenPopup, recordForEdit }) {
  const classes = addAccountStyles();
  const { t } = useTranslation();
  const { user, client, fetchAllAccounts } = useAuth();
  const [loading, setLoading] = useState(false);
  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name ? '' : t('error.name');
    if ('accountNo' in fieldValues)
      temp.accountNo =
        fieldValues.accountNo.length === 12 || fieldValues.accountNo.length === 10
          ? ''
          : t('error.account');
    if ('amount' in fieldValues)
      temp.amount = Number.isInteger(+fieldValues.amount) ? '' : t('error.amount');
    if ('mobile' in fieldValues)
      temp.mobile = Number.isInteger(+fieldValues.mobile) ? '' : t('error.mobile');

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
      await collection.updateOne(
        { accountNo: values.accountNo },
        {
          $set: {
            ...values,
            amount: +values.amount,
            openingDate: new Date(values.openingDate),
            maturityDate: new Date(values.maturityDate),
            agentId: user.id,
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
            label={t('pi.name')}
            name="name"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />
          <Controls.Input
            label={t('account.number')}
            name="accountNo"
            disabled={recordForEdit}
            value={values.accountNo}
            onChange={handleInputChange}
            required
            error={errors.accountNo}
          />
          <Controls.Input
            label={t('account.open')}
            name="openingDate"
            type="date"
            value={values.openingDate}
            onChange={handleInputChange}
            required
            error={errors.openingDate}
          />
          <Controls.Select
            label={t('account.type')}
            name="type"
            value={values.accountType}
            onChange={handleInputChange}
            options={accountTypeList}
            required
            error={errors.accountType}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Input
            label={t('account.amount')}
            name="amount"
            value={values.amount}
            onChange={handleInputChange}
            required
            error={errors.amount}
          />
          <Controls.Input
            label={t('pi.phone')}
            name="phone"
            value={values.phone}
            onChange={handleInputChange}
            error={errors.phone}
          />
          <Controls.Input
            label={t('account.maturity')}
            name="maturityDate"
            type="date"
            value={values.maturityDate}
            onChange={handleInputChange}
            required
            error={errors.maturityDate}
          />
          <Controls.Button
            type="submit"
            text={recordForEdit ? t('account.edit') : t('account.add')}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Form>
  );
}

export default AddAccount;
