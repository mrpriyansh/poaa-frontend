import React, { useEffect, useMemo } from 'react';
import { Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useSWR, { useSWRConfig } from 'swr';

import Control from '../common/controls/Controls';
import { Form } from '../common/useForm';
import { addInstallmentsStyles } from '../styles/components/addInstallments';
import { triggerAlert } from '../services/getAlert/getAlert';
import { ReactComponent as LoaderSVG } from '../assets/icons/spinner.svg';
import { axiosUtil } from '../services/axiosinstance';

const initialValues = {
  name: '',
  accountNo: '',
  amount: '',
  installments: 1,
};

export default function AddInstallment({ setOpenPopup, isModifying, record }) {
  const classes = addInstallmentsStyles();
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const history = useHistory();
  const [inputText, setInputText] = React.useState('');
  const [inputValue, setInputValue] = React.useState({ ...initialValues });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: response } = useSWR('allaccounts', axiosUtil.swr);

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

  const handleAddInstallment = () => {
    if (errors.installments || errors.name) return;
    setIsLoading(true);
    axiosUtil[isModifying ? 'put' : 'post'](
      isModifying ? 'editInstallment' : '/addInstallment',
      inputValue
    )
      .then(res => {
        mutate('getAllInstallments');
        setOpenPopup(false);
        history.push('/create-list');
        setInputValue({ ...initialValues });
        triggerAlert({ icon: 'success', title: res.data });
      })
      .finally(() => setIsLoading(false));
  };

  const rdAccounts = useMemo(
    () =>
      response
        ?.filter(item => item.accountType === 'RD')
        ?.sort((a, b) => a.name.localeCompare(b.name)),
    [response]
  );

  if (!rdAccounts) return <LoaderSVG />;
  return (
    <Form onSubmit={handleAddInstallment} className={classes.root}>
      <Grid container justifyContent="center">
        <Autocomplete
          className={classes.autoCompleteRoot}
          options={rdAccounts.map(option => ({
            name: option.name,
            installments: 1,
            amount: option.amount,
            accountNo: option.accountNo,
          }))}
          fullWidth
          renderInput={params => (
            <TextField
              name="name"
              {...params}
              label={t('pi.name')}
              required
              variant="outlined"
              {...(errors.name && { error: true, helperText: errors.name })}
            />
          )}
          filterOptions={options => {
            return options.filter(option => {
              return (
                option.name.toLowerCase().includes(inputText.toLowerCase()) ||
                option.accountNo.includes(inputText)
              );
            });
          }}
          // value={inputValue}
          disabled={isModifying || isLoading}
          onChange={(_, newValue) => {
            console.log('dsfad', newValue);
            if (newValue) setInputValue(newValue);
            else setInputValue({ ...initialValues });
          }}
          inputValue={inputText}
          onInputChange={(_, newInputValue) => {
            console.log('f');
            handleChangeInputText(newInputValue);
          }}
          getOptionLabel={option => option.name}
          renderOption={(props, option, a) => {
            console.log(props, a, option);
            return (
              <li {...props} key={option.accountNo}>
                <span style={{ fontSize: '0.85em', fontWeight: '700' }}>{option.name} &nbsp;</span>
                <span style={{ fontSize: '0.85em', color: 'green' }}>{option.amount}</span> &nbsp;
              </li>
            );
          }}
        />
        <TextField
          label={t('account.amount')}
          value={inputValue.amount}
          variant="outlined"
          fullWidth
          disabled={isModifying || isLoading}
        />
        <TextField
          label={t('account.number')}
          value={inputValue.accountNo}
          variant="outlined"
          fullWidth
          disabled={isModifying || isLoading}
        />
        <TextField
          label={t('installment.number')}
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
          text={t('operation.save')}
          onClick={handleAddInstallment}
          classes={{ root: classes.saveButton }}
          disabled={isLoading}
        />
      </Grid>
    </Form>
  );
}
