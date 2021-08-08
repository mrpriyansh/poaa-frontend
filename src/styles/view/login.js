import { makeStyles } from '@material-ui/core';

export const loginStyles = makeStyles(theme => ({
  titleRoot: {
    fontWeight: '700',
  },
  pageContent: {
    margin: theme.spacing(4),
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(10),
  },
  inputRoot: {
    marginTop: theme.spacing(4),
  },
  buttonRoot: {
    marginTop: theme.spacing(4),
  },
}));
