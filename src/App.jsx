import React, { useState, useEffect, lazy, useMemo } from 'react';
import { Detector } from 'react-detect-offline';
import { useHistory } from 'react-router-dom';
import * as locales from '@mui/material/locale';
import { useTranslation } from 'react-i18next';

import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthContext } from './services/Auth';
import { theme } from './styles/customTheme';
import UserDetailsForm from './view/UserDetailsForm';
import { axiosUtil } from './services/axiosinstance';
import './i18n';
import Banner from './featureFlags/Banner';
import ForceLogout from './featureFlags/ForceLogout';

const Header = lazy(() => import('./components/Header'));
const Login = lazy(() => import('./view/Login'));
const Accounts = lazy(() => import('./view/Accounts'));
const StatisticList = lazy(() => import('./components/StatisticList'));
const GenerateList = lazy(() => import('./view/GenerateList'));
const PreviousList = lazy(() => import('./view/PreviousList'));
const OfflineView = lazy(() => import('./view/Offline'));
const ProtectedRoute = lazy(() => import('./common/ProtectedRoute'));
const FeatureFlag = lazy(() => import('./featureFlags/FeatureFlag'));

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
    const sw = window.localStorage.getItem('swUnregistered');
    if (!sw) {
      serviceWorkerRegistration.unregister();
      window.localStorage.setItem('swUnregistered', true);
    }
  }, []);

  useEffect(() => {
    const removedOldToken = window.localStorage.getItem('removedOldToken');
    let token = null;
    if (!removedOldToken) {
      window.localStorage.clear();
      window.localStorage.setItem('removedOldToken', true);
    } else {
      token = window.localStorage.getItem('token');
    }
    if (token) setAuthToken(token);
  }, []);
  window.onstorage = () => {
    const token = window.localStorage.getItem('token');
    setAuthToken(token);
  };
  const themeWithLocale = useMemo(() => createTheme(theme, locales[i18n.language]), [
    i18n.language,
  ]);

  return (
    <StyledEngineProvider injectFirst>
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
                        <GenerateList />
                      </ProtectedRoute>
                      <ProtectedRoute exact path="/accounts">
                        <Accounts />
                      </ProtectedRoute>
                      <ProtectedRoute exact path="/login">
                        <Login />
                      </ProtectedRoute>
                      <ProtectedRoute exact path="/user-details">
                        <UserDetailsForm />
                      </ProtectedRoute>
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
          <FeatureFlag name="forceLogout">
            <ForceLogout />
          </FeatureFlag>
          <FeatureFlag name="banner">
            <Banner />
          </FeatureFlag>
        </AuthContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
