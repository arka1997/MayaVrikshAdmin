import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import { queryClient } from './lib/queryClient';
import { muiTheme } from './theme/muiTheme';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ThemeProvider as CustomThemeProvider } from './components/common/ThemeProvider';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Plants from './pages/Plants';
import PlantForm from './pages/PlantForm';
import VariantsManagement from './pages/VariantsManagement';
import Settings from './pages/Settings';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={muiTheme}>
            <CustomThemeProvider>
              <CssBaseline />
              <Router>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/plants" element={<Plants />} />
                    <Route path="/plants/new" element={<PlantForm />} />
                    <Route path="/plants/edit/:id" element={<PlantForm />} />
                    <Route path="/variants" element={<VariantsManagement />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AdminLayout>
              </Router>
              <Toaster />
            </CustomThemeProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
