import { makeStyles } from '@material-ui/core';

export const generateListStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  generateButtonWrapper: {
    padding: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
}));
