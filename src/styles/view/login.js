import { makeStyles } from '@material-ui/core';

export const loginStyles = makeStyles(theme => ({
  root: {
    background: '#fafafa',
    display: 'flex',
    justifyContent: 'center',
    '& .MuiGrid-item': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
    width: '300px',
  },
}));
