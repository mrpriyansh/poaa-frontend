import { makeStyles } from '@material-ui/core';

export const previousListsStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  heading: {
    marginBottom: theme.spacing(2),
  },
  listTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  listTitle: { width: '100%' },
  row: {
    display: 'flex',
    alignItems: 'center',
    '& > span': {
      margin: theme.spacing(0, 1),
    },
  },
}));
