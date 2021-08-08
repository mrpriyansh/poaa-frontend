import { makeStyles } from '@material-ui/core';

export const headerStyles = makeStyles({
  root: {
    background: '#3454d1',
  },
  title: {
    color: '#000',
  },
  grow: {
    flexGrow: 1,
  },
  button: {},
  '& .MuiButton-label': {
    color: '#fff',
  },
});
