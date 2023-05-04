import makeStyles from '@mui/styles/makeStyles';

export const previousListsStyles = makeStyles(theme => ({
  root: {
    minWidth: '70vw',
    padding: theme.spacing(2),
  },

  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  [theme.breakpoints.down('sm')]: {
    gridItem: {
      alignItems: 'flex-start',
      borderTop: '0.75px solid #888',
      marginBottom: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
  },
}));
