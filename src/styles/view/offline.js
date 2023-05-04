import makeStyles from '@mui/styles/makeStyles';

export const offlineStyles = makeStyles(theme => ({
  root: {
    minHeight: '70vh',
    // minWidth: '70vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));
