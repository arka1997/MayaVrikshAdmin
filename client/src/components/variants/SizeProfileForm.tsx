import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sizeProfileSchema, type SizeProfileData } from '@/validation/plantSchemas';
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

interface SizeProfileFormProps {
  plantId: string;
}

export function SizeProfileForm({ plantId }: SizeProfileFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<SizeProfileData>({
    resolver: zodResolver(sizeProfileSchema),
    defaultValues: {
      plantId,
      size: 'Small',
      height: 0,
      weight: 0,
    },
  });

  const { data: sizeProfiles = [] } = useQuery({
    queryKey: ['size-profiles', plantId],
    queryFn: async () => {
      const response = await axios.get(`/api/size-profiles?plantId=${plantId}`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SizeProfileData) => {
      const response = await axios.post('/api/size-profiles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['size-profiles', plantId] });
      showSuccessToast('Size profile saved successfully');
      form.reset({ plantId, size: 'Small' });
    },
    onError: () => {
      showErrorToast('Failed to save size profile');
    },
  });

  const onSubmit = (data: SizeProfileData) => {
    createMutation.mutate(data);
  };

  const sizeOptions = [
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
  ];

  return (
    <Box>
      <Typography variant="h6" className="mb-4">
        Size Profiles
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="size"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Size</InputLabel>
                      <Select {...field} label="Size">
                        {sizeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="height"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Height (cm)"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="weight"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Weight (kg)"
                      type="number"
                      step="0.1"
                      fullWidth
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
                data-testid="button-save-size-profile"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Size Profile'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Display existing size profiles */}
      <Box className="mt-6">
        <Typography variant="h6" className="mb-4">
          Existing Size Profiles
        </Typography>
        {sizeProfiles.length === 0 ? (
          <Typography color="textSecondary">
            No size profiles added yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {sizeProfiles.map((profile: any) => (
              <Grid item xs={12} md={4} key={profile.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{profile.size}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Height: {profile.height} cm
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Weight: {profile.weight} kg
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
