import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './styles/global.css';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0074d9',
      light: '#4d9eeb',
      dark: '#005fb3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5D6A7D',
      light: '#8497a9',
      dark: '#344054',
      contrastText: '#fff',
    },
    success: {
      main: '#44BD32',
      light: '#72d761',
      dark: '#2e8422',
    },
    error: {
      main: '#E74C3C',
      light: '#ee7368',
      dark: '#a1352a',
    },
    warning: {
      main: '#F7B731',
      light: '#f9c65f',
      dark: '#ac8022',
    },
    info: {
      main: '#3498DB',
      light: '#62b3e5',
      dark: '#246a99',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);