import makeStyles from '@mui/styles/makeStyles';

export const addInstallmentsStyles = makeStyles(() => ({
  autoCompleteRoot: {
    margin: '0.5em',
    '&  .MuiTextField-root': {
      margin: '0',
    },
  },
  saveButton: {
    width: '80%',
    margin: '0.5em',
  },
}));
