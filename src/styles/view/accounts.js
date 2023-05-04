import makeStyles from '@mui/styles/makeStyles';

export const allAccountStyles = makeStyles(theme => ({
  toolbarRoot: {
    flexDirection: 'column',
  },
  pageContent: {
    minWidth: '70vw',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  addInstButton: {
    margin: theme.spacing(1, 3, 2, 3),
  },
  maturityCheckboxWrapper: {
    marginLeft: 'auto',
  },
}));
