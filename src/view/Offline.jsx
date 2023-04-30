import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { ReactComponent as OfflineSVG } from '../assets/icons/offline.svg';
import { offlineStyles } from '../styles/view/offline';

function Offline() {
  const classes = offlineStyles();
  return (
    <Paper className={classes.root}>
      <OfflineSVG width="300px" height="300px" />
      <Typography variant="h5">Facing Issue to Connect </Typography>
      <Typography variant="body1"> Check Your Internet Connection</Typography>
    </Paper>
  );
}

export default Offline;
