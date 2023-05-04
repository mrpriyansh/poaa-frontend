import makeStyles from '@mui/styles/makeStyles';

export const usingExcelStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      width: '90%',
    },
    '& .MuiTextField-root': {
      width: '90%',
    },
    '& .MuiFormControl-root': {
      width: '90%',
    },
    '& .MuiGrid-grid-xs-6': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
}));
