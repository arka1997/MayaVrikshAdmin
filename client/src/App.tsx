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
import PlantVariants from './pages/PlantVariants';
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
                <Routes>
                  {/* Routes with AdminLayout (sidebar/navbar) */}
                  <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
                  <Route path="/plants" element={<AdminLayout><Plants /></AdminLayout>} />
                  <Route path="/variants" element={<AdminLayout><VariantsManagement /></AdminLayout>} />
                  <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
                  
                  {/* Routes without AdminLayout (full page) */}
                  <Route path="/plant-form" element={<PlantForm />} />
                  <Route path="/plant-variants" element={<PlantVariants />} />
                </Routes>
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
