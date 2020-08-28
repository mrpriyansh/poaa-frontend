import React, { useState, useEffect } from 'react';
import { makeStyles, CssBaseline } from '@material-ui/core';
import { Route } from 'react-router-dom';
import Header from './view/Header';
import Login from './view/Login';
import AllAccounts from './view/AllAccounts';
import StatisticList from './view/StatisticList';
import { AuthContext } from './services/Auth';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#fff',
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
    <AuthContext.Provider value={{ authToken, setAuthToken, statsData, setStatsData }}>
      <div className={classes.root}>
        <Header />
        <Route exact path="/">
          {authToken ? <AllAccounts /> : <Login />}
        </Route>
        <Route exact path="/stats"> <StatisticList /> </Route>
      </div>
      <CssBaseline />
    </AuthContext.Provider>
  );
}

export default App;
