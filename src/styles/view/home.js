import { makeStyles } from '@material-ui/core';

export const allAccountStyles = makeStyles(theme => ({
  toolbarRoot: {
    flexDirection: 'column',
  },
  pageContent: {
    minWidth: '70vw',
    padding: theme.spacing(2),
  },
}));
