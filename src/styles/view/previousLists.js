import { makeStyles } from '@material-ui/core';

export const previousListsStyles = makeStyles(theme => ({
  root: {
    minWidth: '70vw',
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
  },
  lightGreenText: {
    color: theme.palette.success.main,
  },
  greenText: {
    color: theme.palette.success.dark,
  },

  gridItem: {},
  [theme.breakpoints.down('xs')]: {
    gridItem: {
      alignItems: 'flex-start',
      borderTop: '0.75px solid #888',
      marginBottom: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
  },
}));
