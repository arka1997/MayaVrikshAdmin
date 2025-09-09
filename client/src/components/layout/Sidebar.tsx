import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Eco, 
  Dashboard, 
  Category, 
  LocalFlorist, 
  Palette, 
  Sell,
  Spa
} from '@mui/icons-material';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: Dashboard },
  { name: 'Products', path: '/plants', icon: Spa },
  { name: 'Product Variants', path: '/variants', icon: Category },
  { name: 'Categories', path: '/categories', icon: Category },
  { name: 'Fertilizers', path: '/fertilizers', icon: LocalFlorist },
  { name: 'Colors', path: '/colors', icon: Palette },
  { name: 'Tags', path: '/tags', icon: Sell },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex-shrink-0 shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-green rounded-lg flex items-center justify-center">
            <Eco className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Maya Vriksh</h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start space-x-3 h-12 ${
                    isActive 
                      ? 'gradient-green text-white font-medium' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                  onClick={() => navigate(item.path)}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className={isActive ? 'text-white' : 'text-primary'} />
                  <span>{item.name}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
