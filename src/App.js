import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Route } from 'react-router-dom';
import * as Realm from 'realm-web';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';

import { AuthContext } from './services/Auth';
import { theme } from './styles/customTheme';
import ConfirmUser from './view/ConfirmUser';
import UserDetailsForm from './view/UserDetailsForm';
import { INSTALLMENT_PENDING } from './services/constants';

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
  const [isOnline, setIsOnline] = useState(true);

  const [app, setApp] = useState(new Realm.App({ id: process.env.REACT_APP_REALM_ID }));
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);

  const [installments, setInstallments] = useState();
  const [allAccounts, setAllAccounts] = useState();

  const fetchAllAccounts = async () => {
    try {
      const collection = await client.db('poaa').collection('accounts');
      const data = await collection.aggregate([{ $sort: { maturityDate: 1 } }]);
      setAllAccounts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInstallments = async () => {
    const collection = await client.db('poaa').collection('installments');
    const data = await collection.aggregate([{ $match: { status: INSTALLMENT_PENDING } }]);
    setInstallments(data);
  };

  useEffect(() => {
    async function initClientsUser() {
      console.log('hello', user, app.currentUser);
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
  useEffect(() => {
    window.addEventListener('online', () => {
      setIsOnline(true);
    });
    return () => window.removeEventListener('online', () => {});
  }, []);

  useEffect(() => {
    window.addEventListener('offline', () => {
      setIsOnline(false);
    });
    return () => window.removeEventListener('offline', () => {});
  }, []);

  return (
    <Suspense fallback={<div> Loading ... </div>}>
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
            <Header isOnline />
            <div className={classes.container}>
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
              <ProtectedRoute exact path="/generate-list">
                <GenerateList />
              </ProtectedRoute>
              <ProtectedRoute exact path="/previous-lists">
                <PreviousList />
              </ProtectedRoute>
              <ProtectedRoute exact path="/stats">
                <StatisticList />
              </ProtectedRoute>{' '}
            </div>
          </>
          <CssBaseline />
        </AuthContext.Provider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
