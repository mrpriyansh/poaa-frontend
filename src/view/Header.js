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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" classes={{ root: classes.titleRoot }}>
          Post Office Agent Assistant
        </Typography>
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
