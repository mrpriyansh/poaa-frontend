import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as OfflineSVG } from '../assets/icons/offline.svg';
import { offlineStyles } from '../styles/view/offline';

function Offline() {
  const classes = offlineStyles();
  const history = useHistory();
  return (
    <Paper className={classes.root}>
      <OfflineSVG width="300px" height="300px" />
      <Typography variant="h5">You are offline. </Typography>
      <Typography variant="body1"> Check your internet connection</Typography>
    </Paper>
  );
}

export default Offline;
