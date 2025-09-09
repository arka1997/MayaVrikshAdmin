import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import type { RootState } from '@/store';
import { PlantForm } from '@/components/plants/PlantForm';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-components';
import { Typography, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '@/components/ui/mui-components';
import axios from 'axios';

export default function PlantFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: plant, isLoading } = useQuery({
    queryKey: ['plants', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(`/api/plants/${id}`);
      return response.data;
    },
    enabled: isEdit,
  });

  const handleSaved = () => {
    navigate('/plants');
  };

  const handleCancel = () => {
    navigate('/plants');
  };

  if (isEdit && isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <Typography>Loading plant data...</Typography>
      </Box>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outlined"
          onClick={() => navigate('/plants')}
          data-testid="button-back"
        >
          <ArrowBack className="mr-2" />
          Back to Plants
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Plant' : 'Add New Plant'}
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <Typography variant="h6">
            {isEdit ? 'Update Plant Information' : 'Plant Information'}
          </Typography>
        </CardHeader>
        <CardContent>
          <PlantForm
            plant={plant}
            onSaved={handleSaved}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
