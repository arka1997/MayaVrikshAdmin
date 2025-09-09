import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { toggleDarkMode } from '@/store/slices/themeSlice';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Switch, 
  FormControlLabel,
  Box,
  Divider
} from '@/components/ui/mui-components';
import { DarkMode, LightMode } from '@mui/icons-material';

export default function Settings() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h4" component="h1">
          Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Customize your dashboard preferences
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <Typography variant="h6">
            Appearance
          </Typography>
        </CardHeader>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                color="primary"
                data-testid="switch-dark-mode"
              />
            }
            label={
              <Box className="flex items-center space-x-2">
                {darkMode ? <DarkMode /> : <LightMode />}
                <span>Dark Mode</span>
              </Box>
            }
          />
          <Typography variant="body2" color="textSecondary" className="mt-2">
            Toggle between light and dark theme for the dashboard
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Typography variant="h6">
            About
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography variant="body1" className="mb-2">
            Maya Vriksh Admin Dashboard
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-4">
            Version 1.0.0
          </Typography>
          <Divider className="my-4" />
          <Typography variant="body2" color="textSecondary">
            Built with React, TypeScript, Material UI, and Redux Toolkit
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
