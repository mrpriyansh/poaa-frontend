import React, { useState, useEffect, lazy, useMemo } from 'react';
import { Detector } from 'react-detect-offline';
import { Route, useHistory } from 'react-router-dom';
import * as locales from '@material-ui/core/locale';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Snackbar, ThemeProvider, createTheme } from '@material-ui/core';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthContext } from './services/Auth';
import { theme } from './styles/customTheme';
import ConfirmUser from './view/ConfirmUser';
import UserDetailsForm from './view/UserDetailsForm';
import Button from './common/controls/Button';
import { axiosUtil } from './services/axiosinstance';
import './i18n';

const Header = lazy(() => import('./components/Header'));
const Login = lazy(() => import('./view/Login'));
const Home = lazy(() => import('./view/Home'));
const StatisticList = lazy(() => import('./components/StatisticList'));
const GenerateList = lazy(() => import('./view/GenerateList'));
const PreviousList = lazy(() => import('./view/PreviousList'));
const OfflineView = lazy(() => import('./view/Offline'));
const ProtectedRoute = lazy(() => import('./common/ProtectedRoute'));

const useStyles = makeStyles({
  container: {
    padding: '1em 0.5em',
  },
});

function App() {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const history = useHistory();
  const [statsData, setStatsData] = useState([]);
  const [authToken, setAuthToken] = useState(false);

  const [user, setUser] = useState(null);

  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const onSWUpdate = registration => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload(true);
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, []);

  useEffect(() => {
    if (user && !user?.pPassword?.length) {
      history.push('/user-details');
    }
  }, [user, history]);

  useEffect(() => {
    async function fetchUser() {
      const response = await axiosUtil.get('userdetails');
      setUser(response.data);
    }

    if (authToken) fetchUser();
    else setUser(null);
  }, [authToken]);

  useEffect(() => {
    const token = window.localStorage.getItem('token1');
    if (token) setAuthToken(token);
  }, []);
  window.onstorage = () => {
    const token = window.localStorage.getItem('token1');
    setAuthToken(token);
  };
  const themeWithLocale = useMemo(() => createTheme(theme, locales[i18n.language]), [
    i18n.language,
  ]);

  return (
    <ThemeProvider theme={themeWithLocale}>
      <AuthContext.Provider
        value={{
          authToken,
          setAuthToken,
          statsData,
          setStatsData,
          user,
          setUser,
        }}
      >
        <>
          <Header />
          <div className={classes.container}>
            <Detector
              polling={{ url: 'https://ipv4.icanhazip.com/' }}
              render={({ online }) =>
                online ? (
                  <>
                    <ProtectedRoute exact path="/">
                      <Home />
                    </ProtectedRoute>
                    <Route exact path="/login">
                      {' '}
                      <Login />{' '}
                    </Route>
                    <ProtectedRoute exact path="/user-details">
                      <UserDetailsForm />
                    </ProtectedRoute>
                    <Route exact path="/confirm-user">
                      <ConfirmUser />{' '}
                    </Route>
                    <ProtectedRoute exact path="/create-list">
                      <GenerateList />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/previous-lists">
                      <PreviousList />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/stats">
                      <StatisticList />
                    </ProtectedRoute>{' '}
                  </>
                ) : (
                  <OfflineView />
                )
              }
            />
          </div>
        </>
        <CssBaseline />
      </AuthContext.Provider>
      <Snackbar
        open={showReload}
        message="A new version is available!"
        onClick={reloadPage}
        action={<Button color="secondary" size="small" onClick={reloadPage} text="Reload" />}
      />
    </ThemeProvider>
  );
}

export default App;
