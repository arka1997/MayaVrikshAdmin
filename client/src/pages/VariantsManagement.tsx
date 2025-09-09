import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SizeProfileForm } from '@/components/variants/SizeProfileForm';
import { SeasonalCareForm } from '@/components/variants/SeasonalCareForm';
import { FertilizerForm } from '@/components/variants/FertilizerForm';
import { ColorVariantForm } from '@/components/variants/ColorVariantForm';
import { Card, CardContent, CardHeader, Tabs, Tab, Box, Typography } from '@/components/ui/mui-components';
import { 
  Straighten, 
  WbSunny, 
  LocalFlorist, 
  Palette 
} from '@mui/icons-material';
import axios from 'axios';

export default function VariantsManagement() {
  const [searchParams] = useSearchParams();
  const plantId = searchParams.get('plantId');
  const [activeTab, setActiveTab] = useState(0);

  const { data: plant } = useQuery({
    queryKey: ['plants', plantId],
    queryFn: async () => {
      if (!plantId) return null;
      const response = await axios.get(`/api/plants/${plantId}`);
      return response.data;
    },
    enabled: Boolean(plantId),
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!plantId) {
    return (
      <Box className="text-center py-8">
        <Typography variant="h6" color="textSecondary">
          No plant selected for variant management
        </Typography>
      </Box>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h4" component="h1" className="text-foreground">
          Manage Plant Variants
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure sizes, care guidelines, fertilizers, and color variants for {plant?.name || 'Selected Plant'}
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab
              icon={<Straighten />}
              label="Size Profiles"
              data-testid="tab-size-profiles"
            />
            <Tab
              icon={<WbSunny />}
              label="Seasonal Care"
              data-testid="tab-seasonal-care"
            />
            <Tab
              icon={<LocalFlorist />}
              label="Fertilizer Schedule"
              data-testid="tab-fertilizer"
            />
            <Tab
              icon={<Palette />}
              label="Color Variants"
              data-testid="tab-color-variants"
            />
          </Tabs>
        </CardHeader>
        <CardContent>
          <Box hidden={activeTab !== 0}>
            <SizeProfileForm plantId={plantId} />
          </Box>
          <Box hidden={activeTab !== 1}>
            <SeasonalCareForm plantId={plantId} />
          </Box>
          <Box hidden={activeTab !== 2}>
            <FertilizerForm plantId={plantId} />
          </Box>
          <Box hidden={activeTab !== 3}>
            <ColorVariantForm plantId={plantId} />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
