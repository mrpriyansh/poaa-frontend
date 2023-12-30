import { Grid, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import { Form, useForm } from '../common/useForm';
import Controls from '../common/controls/Controls';
import { useAuth } from '../services/Auth';
import { loginStyles } from '../styles/view/login';
import { axiosUtil } from '../services/axiosinstance';
import { triggerAlert } from '../services/getAlert/getAlert';

const initialValues = {
  email: '',
  password: '',
};

const SIGN_UP = 'SignUp';

const fieldsArray = [
  {
    name: 'email',
    key: 'email',
    required: true,
    type: 'text',
  },
  {
    name: 'password',
    key: 'password',
    required: true,
    type: 'password',
  },
];

function Login() {
  const classes = loginStyles();
  const { t } = useTranslation();
  const { setAuthToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const history = useHistory();

  const validate = (fieldValues = values) => {
    const temp = { ...errors };
    if ('email' in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? '' : t('error.email');
    if ('password' in fieldValues)
      temp.password = fieldValues.password.length >= 6 ? '' : t('error.password');
    setErrors({ ...temp });
  };
  const { values, errors, setErrors, handleInputChange } = useForm(initialValues, true, validate);

  const userSignin = () => {
    setLoading(true);
    axiosUtil
      .post('signin', values)
      .then(res => {
        window.localStorage.setItem('token', res.data);
        setAuthToken(res.data);
        history.push('/');
      })
      .finally(() => setLoading(false));
  };

  const userSignup = () => {
    axiosUtil
      .post('signup', values)
      .then(res => {
        history.push('/');
        return triggerAlert(res.data);
      })
      .finally(() => setLoading(false));
  };
  const handleSubmit = event => {
    event.preventDefault();
    if (isLogin) return userSignin();
    return userSignup();
  };

  const changeType = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Paper className={classes.pageContent}>
        <Form onSubmit={handleSubmit}>
          <Grid container justifyContent="center">
            <Typography variant="h5" classes={{ root: classes.titleRoot }}>
              {isLogin ? t('creds.login') : t('creds.signup')}
            </Typography>
            <Grid container item xs={12} justifyContent="center">
              {fieldsArray.map(({ key, name, required, type }) => (
                <Controls.Input
                  variant="outlined"
                  name={name}
                  label={t(`pi.${key}`)}
                  value={values[key]}
                  onChange={handleInputChange}
                  error={errors[key]}
                  classes={{ root: classes.inputRoot }}
                  required={required}
                  type={type}
                />
              ))}
              <Controls.Button
                type="submit"
                text={isLogin ? t('creds.login') : t('creds.signup')}
                disabled={loading}
                classes={{ root: classes.buttonRoot }}
              />

              <Grid container item xs={12} justifyContent="center" className={classes.footLine}>
                {isLogin ? t('creds.newUser') : t('creds.alreadyUser')} &nbsp;
                <span
                  role="button"
                  tabIndex="0"
                  onClick={() => changeType(SIGN_UP)}
                  onKeyDown={() => changeType(SIGN_UP)}
                >
                  {isLogin ? t('creds.signup') : t('creds.login')}
                </span>
              </Grid>
              <Grid container item xs={12} justifyContent="center" className={classes.footLine}>
                <span role="button" tabIndex="0">
                  {t('creds.forgotPwd')}
                </span>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </>
  );
}

export default Login;
