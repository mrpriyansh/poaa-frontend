import { Grid, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import { useHistory } from 'react-router-dom';
import { Warning } from '@material-ui/icons';

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
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit}>
        <Grid container justifyContent="center">
          <Typography variant="h5" classes={{ root: classes.titleRoot }}>
            Update Details
          </Typography>
          <Grid container item xs={12} justifyContent="center">
            <Controls.Input
              variant="outlined"
              label="Name"
              name="name"
              required
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
              classes={{ root: classes.inputRoot }}
              disabled={!needToChange()}
            />

            <Controls.Input
              variant="outlined"
              label="Portal Account No"
              name="pAccountNo"
              required
              value={values.pAccountNo}
              onChange={handleInputChange}
              error={errors.pAccountNo}
              classes={{ root: classes.inputRoot }}
              disabled={!needToChange()}
            />

            <Controls.Input
              variant="outlined"
              type="password"
              label="Portal Current Password"
              name="pPassword"
              required
              value={values.pPassword}
              onChange={handleInputChange}
              error={errors.pPassword}
              classes={{ root: classes.inputRoot }}
              disabled={!needToChange()}
            />

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
  );
}
