import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Route } from 'react-router-dom';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';

import { AuthContext } from './services/Auth';
import { theme } from './styles/customTheme';

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
        <AuthContext.Provider value={{ authToken, setAuthToken, statsData, setStatsData }}>
          <>
            <Header isOnline={isOnline} />
            <div className={classes.container}>
              <Online>
                <Route exact path="/">
                  {authToken ? <Home /> : <Login />}
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
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
