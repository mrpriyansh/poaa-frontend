import makeStyles from '@mui/styles/makeStyles';

export const loginStyles = makeStyles(theme => ({
  titleRoot: {
    fontWeight: '700',
  },
  pageContent: {
    maxWidth: '360px',
    margin: 'auto',
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  inputRoot: {
    marginTop: theme.spacing(4),
  },
  buttonRoot: {
    marginTop: theme.spacing(2),
  },
  footLine: {
    marginTop: theme.spacing(2),
    '& > span': {
      cursor: 'pointer',
      fontWeight: '700',
      color: '#0645AD',
    },
  },
}));
