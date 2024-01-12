import { Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { useHistory } from 'react-router-dom';
import { Warning } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

import Controls from '../common/controls/Controls';
import { Form, useForm } from '../common/useForm';
import { loginStyles } from '../styles/view/login';
import { useAuth } from '../services/Auth';
import { triggerAlert } from '../services/getAlert/getAlert';
import { axiosUtil } from '../services/axiosinstance';
import { encryptString, isNull } from '../services/utils';

const initialValues = {
  name: '',
  pAccountNo: '',
  pPassword: '',
};

const inputFields = [
  {
    label: 'Name',
    name: 'name',
    required: true,
    key: 'name',
    autoComplete: 'name',
  },
  {
    label: 'Portal Account No',
    name: 'pAccountNo',
    required: true,
    key: 'pAccountNo',
  },
  {
    label: 'Portal Current Password',
    name: 'pPassword',
    required: true,
    key: 'pPassword',
    type: 'password',
  },
];

export default function UserDetailsForm() {
  const classes = loginStyles();
  const { user, setUser } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState();
  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name.length > 0 ? '' : 'Enter your name';
    if ('pAccountNo' in fieldValues)
      temp.pAccountNo = fieldValues.pAccountNo.length > 0 ? '' : 'Enter Portal Account No';
    if ('pPassword' in fieldValues)
      temp.pPassword = fieldValues.pPassword.length > 0 ? '' : 'Enter your Portal Password';
    setErrors({ ...temp });
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    true,
    validate
  );

  useEffect(() => {
    if (user)
      setValues({ name: user.name, pAccountNo: user.pAccountNo, pPassword: user.pPassword });
  }, [user, setValues]);

  const handleSubmit = async e => {
    e.preventDefault();

    const notValidInput = isNull(values, ['name', 'pAccountNo', 'pPassword']);
    if (notValidInput)
      return triggerAlert({ icon: 'error', title: 'Please check all the values' });

    setLoading(true);
    axiosUtil
      .patch('update-user-details', {
        name: values.name,
        pAccountNo: values.pAccountNo,
        pPassword: encryptString(values.pPassword),
      })
      .then(res => {
        setUser(res.data);
        history.push('/');
      })
      .finally(() => setLoading(false));
  };

  const needToChange = () => {
    return !user?.pPassword?.length;
  };

  return (
    <>
      <Helmet>
        <title>User Details Form</title>
      </Helmet>
      <Paper className={classes.pageContent}>
        <Form onSubmit={handleSubmit}>
          <Grid container justifyContent="center">
            <Typography variant="h5" classes={{ root: classes.titleRoot }}>
              Update Details
            </Typography>
            <Grid container item xs={12} justifyContent="center">
              {inputFields.map(({ label, name, key, required, autoComplete }) => (
                <Controls.Input
                  variant="outlined"
                  label={label}
                  name={name}
                  required={required}
                  value={values[key]}
                  onChange={handleInputChange}
                  error={errors[key]}
                  classes={{ root: classes.inputRoot }}
                  disabled={!needToChange()}
                  autoComplete={autoComplete || 'off'}
                />
              ))}

              <Controls.Button
                type="submit"
                text={<KeyboardArrowRightRoundedIcon />}
                disabled={loading || !needToChange()}
                classes={{ root: classes.buttonRoot }}
              />
            </Grid>
            {!needToChange() && (
              <Grid container justifyContent="center" alignItems="center">
                <Warning fontSize="small" />
                <Typography variant="subtitle2" align="center">
                  No need to change details.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Form>
      </Paper>
    </>
  );
}
