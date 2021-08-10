import { makeStyles } from '@material-ui/core';

export const statisticListStyles = makeStyles(theme => ({
  root: {
    height: 'calc(100vh - 64px)',
    background: '#fafafa',
    display: 'flex',
    justifyContent: 'center',
  },
  pageContent: {
    margin: theme.spacing(0, 5),
    padding: theme.spacing(3),
    overflow: 'auto',
    '&::-webkit-scrollbar:vertical': {
      display: 'none',
    },
  },
  newButton: {
    position: 'absolute',
    right: '0px',
  },
}));
