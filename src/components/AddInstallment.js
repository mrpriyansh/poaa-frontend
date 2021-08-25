import React, { useEffect } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router-dom';
import { mutate } from 'swr';

import Control from '../common/controls/Controls';
import { Form } from '../common/useForm';
import { usePersistentSWR } from '../services/userPersistentswr';
import { axiosUtil } from '../services/axiosinstance';
import { addInstallmentsStyles } from '../styles/components/addInstallments';
import { triggerAlert } from '../services/getAlert/getAlert';

const initialValues = {
  name: '',
  accountno: '',
  amount: '',
  installments: 1,
};

export default function AddInstallment({ setOpenPopup, isModifying, record }) {
  const classes = addInstallmentsStyles();
  const history = useHistory();
  const [inputText, setInputText] = React.useState('');
  const [inputValue, setInputValue] = React.useState({ ...initialValues });
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  const { data, error } = usePersistentSWR('allaccounts', axiosUtil.get);
  useEffect(() => {
    if (isModifying) setInputValue(record);
  }, [isModifying, record]);

  const handleChangeInstallments = e => {
    const { value } = e.target;
    const errorMessage = value > 0 ? '' : 'Invalid Installments Number';
    setErrors({ installments: errorMessage });
    setInputValue(prevState => ({ ...prevState, installments: value }));
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
        history.push('/generate-list');
        setInputValue({ ...initialValues });
        triggerAlert({ icon: 'success', title: res.data });
      })
      .finally(() => setIsLoading(false));
  };

  if (!data && error) return <div> Error occured </div>;
  if (!data) return <div> Loading</div>;
  return (
    <Form onSubmit={handleAddInstallment} className={classes.root}>
      <Grid container justifyContent="center">
        <Autocomplete
          value={inputValue}
          className={classes.autoCompleteRoot}
          fullWidth
          onChange={(_, newValue) => {
            if (newValue) setInputValue(newValue);
            else setInputValue({ ...initialValues });
          }}
          inputValue={inputText}
          onInputChange={(_, newInputValue) => {
            handleChangeInputText(newInputValue);
          }}
          options={data.data
            .filter(item => item.accountType === 'RD')
            .map(option => ({
              name: option.name,
              installments: 1,
              amount: option.amount,
              accountno: option.accountno,
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
        <TextField label="Amount" value={inputValue.amount} variant="outlined" fullWidth />
        <TextField label="Account No" value={inputValue.accountno} variant="outlined" fullWidth />
        <TextField
          label="Installments"
          type="number"
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
