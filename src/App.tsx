import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import AppRoutes from "./routes/appRoutes.tsx";
import {SnackbarProvider} from './contexts/snackbarContext';

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const theme = createTheme({
  palette: {
    mode: prefersDark ? 'dark' : 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
  );
}
