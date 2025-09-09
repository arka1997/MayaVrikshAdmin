import { createTheme } from '@mui/material/styles';

// Green gradient theme colors
const greenColors = {
  primary: {
    main: '#4CAF50', // hsl(122, 39%, 49%)
    light: '#81C784', // hsl(122, 25%, 70%)
    dark: '#1B5E20', // hsl(122, 100%, 11%)
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#81C784',
    light: '#A5D6A7',
    dark: '#2E7D32',
    contrastText: '#ffffff',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
  },
};

const darkGreenColors = {
  primary: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#1B5E20',
    contrastText: '#000000',
  },
  secondary: {
    main: '#81C784',
    light: '#A5D6A7',
    dark: '#2E7D32',
    contrastText: '#000000',
  },
  background: {
    default: '#0F172A', // hsl(222.2, 84%, 4.9%)
    paper: '#0F172A',
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: 'rgba(255, 255, 255, 0.6)',
  },
};

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    ...greenColors,
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#2E7D32',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '10px 24px',
        },
        contained: {
          background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #388E3C 0%, #1B5E20 100%)',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4CAF50',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4CAF50',
              boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: '#E8F5E8',
          color: '#2E7D32',
        },
        colorSecondary: {
          backgroundColor: '#FFF3E0',
          color: '#F57C00',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F1F8E9',
          },
        },
      },
    },
  },
});

export const darkMuiTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkGreenColors,
  },
  typography: muiTheme.typography,
  shape: muiTheme.shape,
  components: {
    ...muiTheme.components,
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        },
      },
    },
  },
});
