import { createTheme } from '@mui/material/styles';

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
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          margin: '0.5em',
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          margin: '0.5em',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          margin: '0.5em',
        },
      },
    },
  },
});
