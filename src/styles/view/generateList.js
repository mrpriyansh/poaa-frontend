import makeStyles from '@mui/styles/makeStyles';

export const generateListStyles = makeStyles(theme => ({
  root: {
    minWidth: '70vw',
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  generateButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },

  [theme.breakpoints.down('sm')]: {
    header: {
      flexDirection: 'column',
    },
  },
}));
