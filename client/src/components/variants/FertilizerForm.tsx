import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fertilizerScheduleSchema, type FertilizerScheduleData } from '@/validation/plantSchemas';
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
  Card,
  CardContent,
} from '@/components/ui/mui-components';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

interface FertilizerFormProps {
  plantId: string;
}

export function FertilizerForm({ plantId }: FertilizerFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<FertilizerScheduleData>({
    resolver: zodResolver(fertilizerScheduleSchema),
    defaultValues: {
      plantId,
      fertilizerId: '',
      applicationFrequency: '',
      applicationMethod: '',
      season: '',
      applicationTime: '',
      dosage: '',
      safetyNotes: '',
    },
  });

  const { data: fertilizers = [] } = useQuery({
    queryKey: ['fertilizers'],
    queryFn: async () => {
      const response = await axios.get('/api/fertilizers');
      return response.data;
    },
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['fertilizer-schedules', plantId],
    queryFn: async () => {
      const response = await axios.get(`/api/fertilizer-schedules?plantId=${plantId}`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FertilizerScheduleData) => {
      const response = await axios.post('/api/fertilizer-schedules', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fertilizer-schedules', plantId] });
      showSuccessToast('Fertilizer schedule saved successfully');
      form.reset({ plantId });
    },
    onError: () => {
      showErrorToast('Failed to save fertilizer schedule');
    },
  });

  const onSubmit = (data: FertilizerScheduleData) => {
    createMutation.mutate(data);
  };

  const applicationFrequencyOptions = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Bi-weekly', label: 'Bi-weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
  ];

  const applicationMethodOptions = [
    { value: 'Foliar Spray', label: 'Foliar Spray' },
    { value: 'Soil Application', label: 'Soil Application' },
    { value: 'Root Drench', label: 'Root Drench' },
  ];

  const seasonOptions = [
    { value: 'All Seasons', label: 'All Seasons' },
    { value: 'Summer', label: 'Summer' },
    { value: 'Winter', label: 'Winter' },
    { value: 'Monsoon', label: 'Monsoon' },
  ];

  const applicationTimeOptions = [
    { value: 'Morning', label: 'Morning' },
    { value: 'Evening', label: 'Evening' },
    { value: 'Anytime', label: 'Anytime' },
  ];

  return (
    <Box>
      <Typography variant="h6" className="mb-4">
        Fertilizer Schedule
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="fertilizerId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Fertilizer</InputLabel>
                      <Select {...field} label="Fertilizer">
                        {fertilizers.map((fertilizer: any) => (
                          <MenuItem key={fertilizer.id} value={fertilizer.id}>
                            {fertilizer.name} ({fertilizer.type})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="applicationFrequency"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Application Frequency</InputLabel>
                      <Select {...field} label="Application Frequency">
                        {applicationFrequencyOptions.map((option) => (
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
                  name="applicationMethod"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Application Method</InputLabel>
                      <Select {...field} label="Application Method">
                        {applicationMethodOptions.map((option) => (
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
                  name="season"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Season</InputLabel>
                      <Select {...field} label="Season">
                        {seasonOptions.map((option) => (
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
                  name="applicationTime"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Application Time</InputLabel>
                      <Select {...field} label="Application Time">
                        {applicationTimeOptions.map((option) => (
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
                  name="dosage"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Dosage"
                      fullWidth
                      placeholder="e.g., 5ml per liter"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="safetyNotes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Safety Notes"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Enter safety instructions and precautions..."
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
                data-testid="button-save-fertilizer-schedule"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Fertilizer Schedule'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Display existing schedules */}
      <Box className="mt-6">
        <Typography variant="h6" className="mb-4">
          Existing Schedules
        </Typography>
        {schedules.length === 0 ? (
          <Typography color="textSecondary">
            No fertilizer schedules added yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {schedules.map((schedule: any) => (
              <Grid item xs={12} md={6} key={schedule.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {fertilizers.find((f: any) => f.id === schedule.fertilizerId)?.name || 'Unknown Fertilizer'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Frequency: {schedule.applicationFrequency}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Method: {schedule.applicationMethod}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Season: {schedule.season}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Dosage: {schedule.dosage}
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
