import { Box, Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import axios from 'axios';

import { Form, useForm } from '../components/useForm';
import Controls from '../components/controls/Controls';
import config from '../services/config';
import handleError from '../services/handleError';
import { triggerAlert } from '../services/getAlert/getAlert';
import { useAuth } from '../services/Auth';

const useStyle = makeStyles(theme => ({
  root: {
    // height: 'calc(100vh - 64px)',
    background: '#fafafa',
    display: 'flex',
    justifyContent: 'center',
    // height: '100%',
    '& .MuiGrid-item': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
    width: '300px',
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
}));

const initialValues = {
  email: '',
  password: '',
};

function Login() {
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
    axios
      .post(`${config.apiUrl}/api/signin`, values)
      .then(res => {
        window.localStorage.setItem('token', res.data);
        setAuthToken(res.data);
      })
      .catch(err => handleError(err, triggerAlert))
      .finally(() => setLoading(false));
  };

  const styles = useStyle();
  return (
    <Box className={styles.root}>
      <Paper className={styles.pageContent}>
        <Form onSubmit={handleSubmit}>
          <Grid container justify="center">
            <Typography>Login</Typography>
            <Grid item xs={12} justify="center">
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
               <Grid container spacing={3}   justify="center"  alignItems="center">
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
