import { Grid, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import * as Realm from 'realm-web';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Form, useForm } from '../common/useForm';
import Controls from '../common/controls/Controls';
import { useAuth } from '../services/Auth';
import { loginStyles } from '../styles/view/login';
import { triggerAlert } from '../services/getAlert/getAlert';
import handleError from '../services/handleError';

const initialValues = {
  email: '',
  password: '',
};

const LOGIN = 'Login';
const SIGN_UP = 'SignUp';

function Login() {
  const classes = loginStyles();
  const { t } = useTranslation();
  const { app, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const history = useHistory();

  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('email' in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? '' : 'Email is not valid.';
    if ('password' in fieldValues)
      temp.password = fieldValues.password.length >= 6 ? '' : 'Enter minimum 6 characters';
    setErrors({ ...temp });
  };
  const { values, errors, setErrors, handleInputChange } = useForm(initialValues, true, validate);

  // const handleSubmit = event => {
  //   event.preventDefault();
  //   setLoading(true);
  //   axiosUtil
  //     .post('signin', values)
  //     .then(res => {
  //       window.localStorage.setItem('token', res.data);
  //       setAuthToken(res.data);
  //     })
  //     .finally(() => setLoading(false));
  // };

  const handleSubmit1 = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const credentials = Realm.Credentials.emailPassword(
          values.email.toLowerCase(),
          values.password
        );
        const temp = await app.logIn(credentials);
        window.localStorage.setItem('token', temp.accessToken);
        setUser(temp);
        history.push('/');
      } else {
        await app.emailPasswordAuth.registerUser(values.email.toLowerCase(), values.password);
        triggerAlert({ icon: 'success', title: 'Account Created!' });
        changeType();
      }
    } catch (error) {
      handleError(error, triggerAlert);
    } finally {
      setLoading(false);
    }
  };

  const changeType = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit1}>
        <Grid container justifyContent="center">
          <Typography variant="h5" classes={{ root: classes.titleRoot }}>
            {isLogin ? t('login') : SIGN_UP}
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
              required
            />
            <Controls.Input
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleInputChange}
              classes={{ root: classes.inputRoot }}
              required
            />
            <Controls.Button
              type="submit"
              text={isLogin ? LOGIN : SIGN_UP}
              disabled={loading}
              classes={{ root: classes.buttonRoot }}
            />

            <Grid container item xs={12} justifyContent="center" className={classes.footLine}>
              {isLogin ? 'Are you new?' : 'Already have an account?'}
              <span
                role="button"
                tabIndex="0"
                onClick={() => changeType(SIGN_UP)}
                onKeyDown={() => changeType(SIGN_UP)}
              >
                {isLogin ? SIGN_UP : LOGIN}
              </span>
            </Grid>
            <Grid container item xs={12} justifyContent="center" className={classes.footLine}>
              <span
                role="button"
                tabIndex="0"
                // onClick={() => changeType(SIGN_UP)}
                // onKeyDown={() => changeType(SIGN_UP)}
              >
                Forgot Password?
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Paper>
  );
}

export default Login;
