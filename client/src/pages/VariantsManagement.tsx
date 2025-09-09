import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EnhancedVariantForm } from '@/components/variants/EnhancedVariantForm';
import { Card, CardContent, CardHeader, Box, Typography } from '@/components/ui/mui-components';
import axios from 'axios';

export default function VariantsManagement() {
  const [searchParams] = useSearchParams();
  const plantId = searchParams.get('plantId');

  const { data: plant } = useQuery({
    queryKey: ['plants', plantId],
    queryFn: async () => {
      if (!plantId) return null;
      const response = await axios.get(`/api/plants/${plantId}`);
      return response.data;
    },
    enabled: Boolean(plantId),
  });

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
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Typography variant="h4" component="h1" className="text-gray-800 font-bold mb-2">
          Manage Plant Variants
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure sizes, care guidelines, fertilizers, and color variants for {plant?.name || 'Selected Plant'}
        </Typography>
      </div>

      <EnhancedVariantForm plantId={plantId} />
    </div>
  );
}
