import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#fff',
    },
    success: {
      main: '#66bb6a',
      dark: '#388e3c',
      light: '#81c784',
    },
  },
  typography: {
    fontFamily: ['Noto Serif', 'serif'],
  },
  props: {
    MuiTextField: {
      size: 'small',
      fullWidth: true,
    },
    MuiMenuItem: {
      dense: true,
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiButton: {
      size: 'small',
    },
  },

  overrides: {
    MuiTextField: {
      root: {
        margin: '0.5em',
      },
    },
    MuiButton: {
      root: {
        margin: '0.5em',
      },
    },
    Autocomplete: {
      root: {
        margin: '0.5em',
      },
    },
  },
});
