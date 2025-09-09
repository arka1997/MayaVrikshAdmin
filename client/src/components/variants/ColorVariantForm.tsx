import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colorVariantSchema, type ColorVariantData } from '@/validation/plantSchemas';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
} from '@/components/ui/mui-components';
import { FileUpload } from '@/components/common/FileUpload';
import { MultiSelect } from '@/components/common/MultiSelect';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

interface ColorVariantFormProps {
  plantId: string;
}

export function ColorVariantForm({ plantId }: ColorVariantFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<ColorVariantData>({
    resolver: zodResolver(colorVariantSchema),
    defaultValues: {
      plantId,
      colorId: '',
      sku: '',
      price: 0,
      costPrice: 0,
      isActive: true,
      notes: '',
      primaryImage: '',
      additionalImages: [],
    },
  });

  const { data: colors = [] } = useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const response = await axios.get('/api/colors');
      return response.data;
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await axios.get('/api/tags');
      return response.data;
    },
  });

  const { data: tagGroups = [] } = useQuery({
    queryKey: ['tag-groups'],
    queryFn: async () => {
      const response = await axios.get('/api/tag-groups');
      return response.data;
    },
  });

  const { data: variants = [] } = useQuery({
    queryKey: ['variants', plantId],
    queryFn: async () => {
      const response = await axios.get(`/api/variants?plantId=${plantId}`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ColorVariantData) => {
      const response = await axios.post('/api/variants', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants', plantId] });
      showSuccessToast('Color variant saved successfully');
      form.reset({ plantId, isActive: true });
    },
    onError: () => {
      showErrorToast('Failed to save color variant');
    },
  });

  const onSubmit = (data: ColorVariantData) => {
    createMutation.mutate(data);
  };

  const handleFilesChange = (files: File[]) => {
    // In a real app, you would upload these files and get URLs
    const urls = files.map(file => URL.createObjectURL(file));
    if (urls.length > 0) {
      form.setValue('primaryImage', urls[0]);
      form.setValue('additionalImages', urls.slice(1));
    }
  };

  const tagOptions = tags.map((tag: any) => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <Box>
      <Typography variant="h6" className="mb-4">
        Color Variants
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="colorId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Color Variant</InputLabel>
                      <Select {...field} label="Color Variant">
                        {colors.map((color: any) => (
                          <MenuItem key={color.id} value={color.id}>
                            <Box className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.hexCode }}
                              />
                              <span>{color.name}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="sku"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="SKU"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Price (MRP)"
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
                  name="costPrice"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Cost Price"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={form.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Active Variant"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box className="mt-4">
              <Typography variant="subtitle1" className="mb-2">
                Tags
              </Typography>
              <MultiSelect
                options={tagOptions}
                value={[]}
                onChange={() => {}}
                placeholder="Select tags..."
              />
              <Typography variant="caption" color="textSecondary" className="mt-1">
                Hold Ctrl/Cmd to select multiple
              </Typography>
            </Box>

            <Box className="mt-4">
              <Typography variant="subtitle1" className="mb-2">
                Variant Images
              </Typography>
              <FileUpload
                onFilesChange={handleFilesChange}
                multiple
                accept="image/*"
                maxSize={10}
              />
            </Box>

            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter variant specific notes..."
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Box className="flex space-x-3 pt-4">
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isPending}
                data-testid="button-save-variant"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Variant'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  form.handleSubmit(onSubmit)();
                  // Reset form for adding another
                  setTimeout(() => form.reset({ plantId, isActive: true }), 100);
                }}
                disabled={createMutation.isPending}
                data-testid="button-save-add-another"
              >
                Save & Add Another
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Display existing variants */}
      <Box className="mt-6">
        <Typography variant="h6" className="mb-4">
          Existing Variants
        </Typography>
        {variants.length === 0 ? (
          <Typography color="textSecondary">
            No color variants added yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {variants.map((variant: any) => (
              <Grid item xs={12} md={6} key={variant.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {colors.find((c: any) => c.id === variant.colorId)?.name || 'Unknown Color'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      SKU: {variant.sku}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ₹{variant.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {variant.isActive ? 'Active' : 'Inactive'}
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
