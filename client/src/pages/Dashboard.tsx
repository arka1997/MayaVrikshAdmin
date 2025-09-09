import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import type { RootState } from '@/store';
import { fetchPlants } from '@/store/slices/plantsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Nature, 
  Category, 
  Star, 
  TrendingUp 
} from '@mui/icons-material';
import axios from 'axios';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { plants, loading: plantsLoading } = useSelector((state: RootState) => state.plants);
  const { categories } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchPlants() as any);
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  // Calculate stats
  const totalPlants = plants.length;
  const activeVariants = plants.filter(p => p.isActive).length;
  const featuredPlants = plants.filter(p => p.isFeatured).length;
  const totalCategories = categories.length;

  const StatCard = ({ title, value, icon: Icon, trend, description }: any) => (
    <Card className="hover-elevate">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            {plantsLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            )}
          </div>
          <div className="w-12 h-12 gradient-green rounded-lg flex items-center justify-center">
            <Icon className="text-white" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="text-primary text-base mr-1" />
            <span className="text-primary font-medium">{trend}</span>
            <span className="text-muted-foreground ml-1">{description}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Plants"
          value={totalPlants}
          icon={Nature}
          trend="+12%"
          description="from last month"
        />
        <StatCard
          title="Active Variants"
          value={activeVariants}
          icon={Category}
          trend="+8%"
          description="from last month"
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          icon={Category}
        />
        <StatCard
          title="Featured Plants"
          value={featuredPlants}
          icon={Star}
          trend="+5%"
          description="from last month"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Plants Added
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plantsLoading ? (
                Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : plants.slice(0, 3).map((plant) => (
                <div key={plant.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 gradient-green rounded-lg flex items-center justify-center">
                    <Nature className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{plant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {plant.scientificName || 'No scientific name'}
                    </p>
                  </div>
                  <Badge 
                    variant={plant.isActive ? "default" : "secondary"}
                    className={plant.isActive ? "status-active" : "status-inactive"}
                  >
                    {plant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
              {!plantsLoading && plants.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No plants added yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Top Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.slice(0, 4).map((category, index) => {
                const categoryPlants = plants.filter(p => p.categoryId === category.id);
                const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-yellow-500'];
                
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                      <span className="text-foreground">{category.name}</span>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {categoryPlants.length} plants
                    </span>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No categories created yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
