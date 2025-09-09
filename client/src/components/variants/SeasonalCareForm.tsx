import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { careGuidelineSchema, type CareGuidelineData } from '@/validation/plantSchemas';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@/components/ui/mui-components';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

interface SeasonalCareFormProps {
  plantId: string;
}

export function SeasonalCareForm({ plantId }: SeasonalCareFormProps) {
  const [activeSeason, setActiveSeason] = useState(0);
  const queryClient = useQueryClient();
  const seasons = ['summer', 'winter', 'monsoon'] as const;

  const form = useForm<CareGuidelineData>({
    resolver: zodResolver(careGuidelineSchema),
    defaultValues: {
      plantId,
      season: seasons[activeSeason],
      wateringFrequency: '',
      waterAmount: 0,
      sunlightType: '',
      humidityLevel: '',
      careNotes: '',
    },
  });

  const { data: careGuidelines = [] } = useQuery({
    queryKey: ['care-guidelines', plantId],
    queryFn: async () => {
      const response = await axios.get(`/api/care-guidelines?plantId=${plantId}`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CareGuidelineData) => {
      const response = await axios.post('/api/care-guidelines', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['care-guidelines', plantId] });
      showSuccessToast('Care guidelines saved successfully');
      form.reset();
    },
    onError: () => {
      showErrorToast('Failed to save care guidelines');
    },
  });

  const handleSeasonChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveSeason(newValue);
    form.setValue('season', seasons[newValue]);
  };

  const onSubmit = (data: CareGuidelineData) => {
    createMutation.mutate(data);
  };

  const wateringFrequencyOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Every 2 days', label: 'Every 2 days' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Bi-weekly', label: 'Bi-weekly' },
  ];

  const sunlightTypeOptions = [
    { value: 'Direct', label: 'Direct' },
    { value: 'Indirect', label: 'Indirect' },
    { value: 'Partial', label: 'Partial' },
    { value: 'Shade', label: 'Shade' },
  ];

  const humidityLevelOptions = [
    { value: 'Low (30-40%)', label: 'Low (30-40%)' },
    { value: 'Medium (40-60%)', label: 'Medium (40-60%)' },
    { value: 'High (60-80%)', label: 'High (60-80%)' },
  ];

  return (
    <Box>
      <Typography variant="h6" className="mb-4">
        Seasonal Care Guidelines
      </Typography>

      <Tabs value={activeSeason} onChange={handleSeasonChange} className="mb-6">
        <Tab label="Summer" data-testid="tab-summer" />
        <Tab label="Winter" data-testid="tab-winter" />
        <Tab label="Monsoon" data-testid="tab-monsoon" />
      </Tabs>

      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="wateringFrequency"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Watering Frequency</InputLabel>
                      <Select {...field} label="Watering Frequency">
                        {wateringFrequencyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="waterAmount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Water Amount (ml)"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="sunlightType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Sunlight Type</InputLabel>
                      <Select {...field} label="Sunlight Type">
                        {sunlightTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="humidityLevel"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Humidity Level</InputLabel>
                      <Select {...field} label="Humidity Level">
                        {humidityLevelOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="careNotes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Care Notes"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isPending}
                data-testid="button-save-care-guidelines"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Care Guidelines'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Display existing guidelines */}
      <Box className="mt-6">
        <Typography variant="h6" className="mb-4">
          Existing Guidelines
        </Typography>
        {careGuidelines.length === 0 ? (
          <Typography color="textSecondary">
            No care guidelines added yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {careGuidelines.map((guideline: any) => (
              <Grid item xs={12} md={4} key={guideline.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="capitalize">
                      {guideline.season}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Watering: {guideline.wateringFrequency}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Amount: {guideline.waterAmount}ml
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Sunlight: {guideline.sunlightType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Humidity: {guideline.humidityLevel}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
