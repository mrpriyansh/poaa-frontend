import React, { useState, useEffect, lazy, useMemo, useCallback } from 'react';
import { Detector } from 'react-detect-offline';
import { useHistory } from 'react-router-dom';
import * as locales from '@mui/material/locale';
import { useTranslation } from 'react-i18next';

import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorker';
import { AuthContext } from './services/Auth';
import { theme } from './styles/customTheme';
import UserDetailsForm from './view/UserDetailsForm';
import { axiosUtil } from './services/axiosinstance';
import './i18n';
import Banner from './featureFlags/Banner';
import ForceLogout from './featureFlags/ForceLogout';
import Popup, { GeneratePopupComponent } from './common/Popup';
import { setPopup } from './redux/popup';
import { REQUEST_NOTIFICATION } from './services/constants';

const Header = lazy(() => import('./components/Header'));
const Login = lazy(() => import('./view/Login'));
const Accounts = lazy(() => import('./view/Accounts'));
const StatisticList = lazy(() => import('./components/StatisticList'));
const GenerateList = lazy(() => import('./view/GenerateList'));
const PreviousList = lazy(() => import('./view/PreviousList'));
const OfflineView = lazy(() => import('./view/Offline'));
const ProtectedRoute = lazy(() => import('./common/ProtectedRoute'));
const FeatureFlag = lazy(() => import('./featureFlags/FeatureFlag'));
const UnpaidInstallments = lazy(() => import('./view/UnpaidInstallments'));

const useStyles = makeStyles({
  container: {
    padding: '1em 0.5em',
  },
});

function App() {
  const classes = useStyles();
  const { i18n, t } = useTranslation();
  const popup = useSelector(state => state.popup);
  const dispatch = useDispatch();
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

  const checkForNotification = useCallback(async () => {
    if (Notification?.permission !== 'granted')
      dispatch(
        setPopup({
          type: REQUEST_NOTIFICATION,
          title: t(REQUEST_NOTIFICATION),
          disableClosing: true,
        })
      );
    await serviceWorkerRegistration.registerSW();
    await serviceWorkerRegistration.subscribeNotification();
  }, [t, dispatch]);

  useEffect(() => {
    checkForNotification();
  }, [checkForNotification]);

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

  const setOpenPopup = value => {
    dispatch(setPopup(value));
  };
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
                      <ProtectedRoute exact path="/unpaid-installments">
                        <UnpaidInstallments />
                      </ProtectedRoute>
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
          <Popup
            title={popup.title}
            openPopup={Boolean(popup.type?.length)}
            setOpenPopup={setOpenPopup}
            disableClosing={popup.disableClosing}
          >
            <GeneratePopupComponent
              type={popup.type}
              {...popup.props}
              setOpenPopup={setOpenPopup}
            />
          </Popup>
        </AuthContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
