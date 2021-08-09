import { Grid, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';

import { Form, useForm } from '../common/useForm';
import Controls from '../common/controls/Controls';
import { useAuth } from '../services/Auth';
import { axiosUtil } from '../services/axiosinstance';
import { loginStyles } from '../styles/view/login';

const initialValues = {
  email: '',
  password: '',
};

function Login() {
  const classes = loginStyles();
  const { setAuthToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('email' in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? '' : 'Email is not valid.';
    setErrors({ ...temp });
  };
  const { values, errors, setErrors, handleInputChange } = useForm(initialValues, true, validate);

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    axiosUtil
      .post('signin', values)
      .then(res => {
        window.localStorage.setItem('token', res.data);
        setAuthToken(res.data);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit}>
        <Grid container justifyContent="center">
          <Typography variant="h5" classes={{ root: classes.titleRoot }}>
            Login
          </Typography>
          <Grid container item xs={12} justifyContent="center">
            <Controls.Input
              variant="outlined"
              label="Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
              classes={{ root: classes.inputRoot }}
            />
            <Controls.Input
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleInputChange}
              classes={{ root: classes.inputRoot }}
            />
            <Controls.Button
              type="submit"
              text="Login"
              disabled={loading}
              classes={{ root: classes.buttonRoot }}
            />
          </Grid>
        </Grid>
      </Form>
    </Paper>
  );
}

export default Login;
