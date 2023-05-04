import makeStyles from '@mui/styles/makeStyles';

export const addAccountStyles = makeStyles(theme => ({
  root: {
    '& .MuiGrid-item': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    '& .MuiButton-root': {
      margin: theme.spacing(1),
    },
  },
}));
