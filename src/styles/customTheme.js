import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: ['Noto Serif', 'serif'],
  },
  props: {
    MuiTextField: {
      size: 'small',
    },
  },
});
