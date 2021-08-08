import { makeStyles } from '@material-ui/core';

export const allAccountStyles = makeStyles(theme => ({
  root: {
    height: 'calc(100vh - 64px)',
    background: '#fafafa',
    display: 'flex',
    justifyContent: 'center',
    // height: '100%'
  },
  pageContent: {
    margin: theme.spacing(0.5, 5),
    padding: theme.spacing(3),
    // minWidth: '990px',
    minHeight: '100%',
    overflow: 'auto',
    '&::-webkit-scrollbar:vertical': {
      display: 'none',
    },
  },
  // pageContent::-webkit-scrollbar: {
  //     display: 'none'
  // },
  newButton: {
    position: 'absolute',
    right: '0px',
  },
}));
