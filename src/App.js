import React, { useState, useEffect } from 'react';
import { makeStyles, CssBaseline, ThemeProvider } from '@material-ui/core';
import { Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './view/Login';
import Home from './view/Home';
import StatisticList from './components/StatisticList';
import { AuthContext } from './services/Auth';
import ProtectedRoute from './common/ProtectedRoute';
import { theme } from './styles/customTheme';
import GenerateList from './view/GenerateList';
import PreviousList from './view/PreviousList';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1em 0.5em',
  },
});

function App() {
  const classes = useStyles();
  const [statsData, setStatsData] = useState([]);
  const [authToken, setAuthToken] = useState(false);
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);
  window.onstorage = () => {
    const token = window.localStorage.getItem('token');
    setAuthToken(token);
  };
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ authToken, setAuthToken, statsData, setStatsData }}>
        <>
          <Header />
          <div className={classes.container}>
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
            </ProtectedRoute>
          </div>
        </>
        <CssBaseline />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
