import { makeStyles } from '@material-ui/core';

export const addAccountStyles = makeStyles(theme => ({
  root: {
    '& .MuiGrid-item': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .MuiTextField-root': {
      width: '80%',
      margin: theme.spacing(1),
    },
    '& .MuiButton-root': {
      width: '80%',
      height: '52px',
      margin: theme.spacing(1),
    },
    '& .MuiFormControl-root': {
      width: '80%',
    },
  },
  button_wrapper: {
    margin: theme.spacing(1),
    width: '100%',
    height: '56px',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
}));
