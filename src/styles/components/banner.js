import makeStyles from '@mui/styles/makeStyles';

export const bannerStyles = makeStyles(() => ({
  paperRoot: {
    textAlign: 'center',
    margin: 'auto',
    width: '100%',
    '& > *': {
      margin: 'auto',
    },
  },
}));
