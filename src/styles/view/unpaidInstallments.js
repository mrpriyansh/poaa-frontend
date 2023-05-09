import makeStyles from '@mui/styles/makeStyles';

export const unpaidInstallmentsStyles = makeStyles(theme => ({
  root: {
    minWidth: '70vw',
    padding: theme.spacing(2, 2),
  },
  [theme.breakpoints.down('sm')]: {
    headerWrapper: {
      justifyContent: 'center',
    },
  },
}));
