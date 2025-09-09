import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleDarkMode } from '@/store/slices/themeSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Notifications, 
  Settings, 
  DarkMode, 
  LightMode 
} from '@mui/icons-material';

export function Header() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-foreground" id="page-title">
            Dashboard
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-80 pl-10 form-input"
              data-testid="input-search"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            data-testid="button-theme-toggle"
          >
            {darkMode ? (
              <LightMode className="h-5 w-5" />
            ) : (
              <DarkMode className="h-5 w-5" />
            )}
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" data-testid="button-notifications">
            <Notifications className="h-5 w-5" />
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-5 w-5" />
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-green rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Admin</p>
              <p className="text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
