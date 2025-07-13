import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    cardColors: {
      peach: string;
      yellow: string;
      gray: string;
      green: string;
      lightPurple: string;
    };
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    cardColors?: {
      peach: string;
      yellow: string;
      gray: string;
      green: string;
      lightPurple: string;
    };
  }
}

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A78BFA', // Main purple
      light: '#C4B2FC', // Lighter purple
      dark: '#8B7ED8', // Darker purple
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4FD1C5', // Teal/turquoise
      light: '#7EDDD8',
      dark: '#3AB5A8',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#FACC15', // Yellow
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#1C1C1E',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1C1E', // Dark text
      secondary: '#6B7280', // Medium gray
    },
    divider: '#E5E7EB',
    cardColors: {
      peach: '#FED7AA',
      yellow: '#FEF3C7',
      gray: '#F3F4F6',
      green: '#D1FAE5',
      lightPurple: '#E2D8FD',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: 16,
    h1: {
      fontWeight: 700,
      fontSize: '32px',
      // lineHeight: 1.2,
      // color: '#1C1C1E',
    },
    h2: {
      fontWeight: 600,
      fontSize: '28px',
      // lineHeight: 1.3,
      // color: '#1C1C1E',
    },
    h3: {
      fontWeight: 600,
      fontSize: '24px',
      // lineHeight: 1.4,
      // color: '#1C1C1E',
    },
    h4: {
      fontWeight: 600,
      fontSize: '20px',
      // lineHeight: 1.4,
      // color: '#1C1C1E',
    },
    h5: {
      fontWeight: 500,
      fontSize: '18px',
      // lineHeight: 1.4,
      // color: '#1C1C1E',
    },
    h6: {
      fontWeight: 500,
      fontSize: '16px',
      // lineHeight: 1.4,
      // color: '#1C1C1E',
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 500,
      // lineHeight: 1.5,
      color: '#6B7280',
    },
    subtitle2: {
      fontSize: '14px',
      fontWeight: 500,
      // lineHeight: 1.5,
      color: '#6B7280',
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
      // lineHeight: 1.6,
      color: '#1C1C1E',
    },
    body2: {
      fontWeight: 400,
      fontSize: '14px',
      // lineHeight: 1.6,
      color: '#6B7280',
    },
    button: {
      fontWeight: 500,
      fontSize: '16px',
      textTransform: 'none',
      // lineHeight: 1.4,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      // lineHeight: 1.5,
      color: '#6B7280',
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
          textTransform: 'none',
          boxShadow: 'none',
          fontWeight: 700,
          padding: '12px 24px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#A78BFA',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8B7ED8',
          },
        },
        containedSecondary: {
          backgroundColor: '#4FD1C5',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#3AB5A8',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          color: '#1C1C1E',
          '&:hover': {
            borderColor: '#A78BFA',
            backgroundColor: 'rgba(167, 139, 250, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #F3F4F6',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#D9D9D9',
            },
            '&:hover fieldset': {
              borderColor: '#A78BFA',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A78BFA',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '14px',
        },
        colorPrimary: {
          backgroundColor: '#E2D8FD',
          color: '#6B46C1',
        },
        colorSecondary: {
          backgroundColor: '#CCFBF1',
          color: '#0F766E',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1C1C1E',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '16px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#E5E7EB',
        },
        bar: {
          backgroundColor: '#4FD1C5',
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E5E7EB',
        },
      },
    },
  },
});

export default baseTheme;