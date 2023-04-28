import { Grid, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Form, useForm } from '../common/useForm';
import Controls from '../common/controls/Controls';
import { useAuth } from '../services/Auth';
import { loginStyles } from '../styles/view/login';
import { axiosUtil } from '../services/axiosinstance';

const initialValues = {
  email: '',
  password: '',
};

const SIGN_UP = 'SignUp';

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

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    axiosUtil
      .post('signin', values)
      .then(res => {
        window.localStorage.setItem('token1', res.data);
        setAuthToken(res.data);
        history.push('/');
      })
      .finally(() => setLoading(false));
  };

  const changeType = () => {
    setIsLogin(prevState => !prevState);
  };

  return (
    <Paper className={classes.pageContent}>
      <Form onSubmit={handleSubmit}>
        <Grid container justifyContent="center">
          <Typography variant="h5" classes={{ root: classes.titleRoot }}>
            {isLogin ? t('creds.login') : t('creds.signup')}
          </Typography>
          <Grid container item xs={12} justifyContent="center">
            <Controls.Input
              variant="outlined"
              label={t('pi.email')}
              name="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
              classes={{ root: classes.inputRoot }}
              required
            />
            <Controls.Input
              variant="outlined"
              label={t('pi.password')}
              name="password"
              type="password"
              value={values.password}
              onChange={handleInputChange}
              classes={{ root: classes.inputRoot }}
              error={errors.password}
              required
            />
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
  );
}

export default Login;
