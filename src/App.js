import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Route } from 'react-router-dom';
import * as Realm from 'realm-web';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Snackbar, ThemeProvider } from '@material-ui/core';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthContext } from './services/Auth';
import { theme } from './styles/customTheme';
import ConfirmUser from './view/ConfirmUser';
import UserDetailsForm from './view/UserDetailsForm';
import { INSTALLMENT_PENDING } from './services/constants';
import { ReactComponent as LoaderSVG } from './assets/icons/spinner.svg';
import Button from './common/controls/Button';
import { axiosUtil } from './services/axiosinstance';
import config from './services/config';

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
  const [statsData, setStatsData] = useState([]);
  const [authToken, setAuthToken] = useState(false);
  const [maturityState, setMaturityState] = useState(false);

  const [app, setApp] = useState(new Realm.App({ id: process.env.REACT_APP_REALM_ID }));
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);

  const [installments, setInstallments] = useState();
  const [allAccounts, setAllAccounts] = useState();

  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const fetchAllAccounts = useCallback(async () => {
    try {
      const collection = await client.db('poaa').collection('accounts');
      const data = await collection.aggregate([
        {
          $sort: { maturityDate: 1 },
        },
        {
          $match: {
            $or: [
              {
                $expr: !maturityState,
              },
              {
                maturityDate: {
                  $lte: new Date(),
                },
              },
            ],
          },
        },
      ]);
      setAllAccounts(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }, [client, maturityState]);

  const fetchInstallments = useCallback(async () => {
    try {
      const collection = await client.db('poaa').collection('installments');
      const data = await collection.aggregate([
        { $match: { status: INSTALLMENT_PENDING } },
        { $sort: { name: 1 } },
      ]);
      setInstallments(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [client]);

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
    axiosUtil.get(`${config.apiUrl}`);
  }, []);

  useEffect(() => {
    async function initClientsUser() {
      if (!user && app.currentUser) {
        setUser(app.currentUser);
      }
      if (!client && user) setClient(user.mongoClient('mongodb-atlas'));
    }
    initClientsUser();
  }, [user, client, app]);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);
  window.onstorage = () => {
    const token = window.localStorage.getItem('token');
    setAuthToken(token);
  };
  return (
    <Suspense fallback={<LoaderSVG />}>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider
          value={{
            authToken,
            setAuthToken,
            statsData,
            setStatsData,
            app,
            setApp,
            client,
            setClient,
            user,
            setUser,
            installments,
            fetchInstallments,
            allAccounts,
            fetchAllAccounts,
          }}
        >
          <>
            <Header />
            <div className={classes.container}>
              <Online>
                <ProtectedRoute exact path="/">
                  <Home maturityState={maturityState} setMaturityState={setMaturityState} />
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
                <ProtectedRoute exact path="/generate-list">
                  <GenerateList />
                </ProtectedRoute>
                <ProtectedRoute exact path="/previous-lists">
                  <PreviousList />
                </ProtectedRoute>
                <ProtectedRoute exact path="/stats">
                  <StatisticList />
                </ProtectedRoute>{' '}
              </Online>
              <Offline>
                <OfflineView />
              </Offline>
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
    </Suspense>
  );
}

export default App;
