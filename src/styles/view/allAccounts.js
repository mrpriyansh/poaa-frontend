import { makeStyles } from '@material-ui/core';

export const allAccountStyles = makeStyles(theme => ({
  toolbarRoot: {
    flexDirection: 'column',
  },
  pageContent: {
    // margin: theme.spacing(0.5, 5),
    padding: theme.spacing(2),
    // minWidth: '990px',
    minHeight: '100%',
    overflow: 'auto',
    '&::-webkit-scrollbar:vertical': {
      display: 'none',
    },
  },
  newButton: {
    // position: 'absolute',
    // right: '0px',
  },
  typeField: {
    minWidth: '12em',
  },
}));
