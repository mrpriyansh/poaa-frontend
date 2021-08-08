import { Box, Grid, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';

import { Form, useForm } from '../components/useForm';
import Controls from '../components/controls/Controls';
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
    <Box className={classes.root}>
      <Paper className={classes.pageContent}>
        <Form onSubmit={handleSubmit}>
          <Grid container justifyContent="center">
            <Typography>Login</Typography>
            <Grid item xs={12}>
              <Controls.Input
                variant="outlined"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
              />
              <Controls.Input
                variant="outlined"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleInputChange}
              />
              <Controls.Button type="submit" text="Login" disabled={loading} />
            </Grid>
          </Grid>
        </Form>
        {/* <form onSubmit={handleSubmit} className={styles.form}>
               <Grid container spacing={3}   justifyContent="center"  alignItems="center">
                    <Grid item><Typography variant='h3'> SignIn</Typography></Grid>
                    <Grid item>
                    <TextField
                        variant="outlined"
                        label="Email"
                        required
                        value={email}
                        onChange={e=>{changeEmail(e.target.value)}}
                    />
                    </Grid>
                    <Grid item>
                    <TextField
                        variant="outlined"
                        label="Password"
                        required
                        value={password}
                        onChange={e=>{changePassword(e.target.value)}}
                    />
                    </Grid>
                    <Button color="primary" onClick={handleSubmit}> SignIn</Button>
                </Grid>
           </form>
                 */}
      </Paper>
    </Box>
  );
}

export default Login;
