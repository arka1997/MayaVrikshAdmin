import { SizeProfileForm } from './SizeProfileForm';
import { SeasonalCareForm } from './SeasonalCareForm';
import { FertilizerForm } from './FertilizerForm';
import { ColorVariantForm } from './ColorVariantForm';
import { Box, Typography, Tabs, Tab } from '@/components/ui/mui-components';
import { useState } from 'react';

interface VariantFormProps {
  plantId: string;
}

export function VariantForm({ plantId }: VariantFormProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Size Profiles" />
        <Tab label="Seasonal Care" />
        <Tab label="Fertilizer Schedule" />
        <Tab label="Color Variants" />
      </Tabs>

      <Box className="mt-6">
        {activeTab === 0 && <SizeProfileForm plantId={plantId} />}
        {activeTab === 1 && <SeasonalCareForm plantId={plantId} />}
        {activeTab === 2 && <FertilizerForm plantId={plantId} />}
        {activeTab === 3 && <ColorVariantForm plantId={plantId} />}
      </Box>
    </Box>
  );
}
