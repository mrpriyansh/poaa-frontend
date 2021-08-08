import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import { useAuth } from '../services/Auth';
import { headerStyles } from '../styles/view/header';

function Header() {
  const classes = headerStyles();
  const { setAuthToken, authToken } = useAuth();
  const handleLogout = event => {
    event.preventDefault();
    window.localStorage.removeItem('token');
    setAuthToken();
  };
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h4" className={classes.title}>
          POAA
        </Typography>
        <div className={classes.grow} />
        {authToken && (
          <>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
