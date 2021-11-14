import { makeStyles } from '@material-ui/core';

export const generateListStyles = makeStyles(theme => ({
  root: {
    minWidth: '70vw',
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  generateButtonWrapper: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'center',
  },

  [theme.breakpoints.down('xs')]: {
    header: {
      flexDirection: 'column',
    },
  },
}));
