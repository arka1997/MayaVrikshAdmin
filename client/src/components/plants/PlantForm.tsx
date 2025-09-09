import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plantFormSchema, type PlantFormData } from '@/validation/plantSchemas';
import {
  TextField,
  Button,
  FormControlLabel,
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Box,
  Typography,
  Chip,
  Autocomplete,
} from '@/components/ui/mui-components';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import { MultiSelect } from '@/components/common/MultiSelect';
import axios from 'axios';

interface PlantFormProps {
  plant?: any;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function PlantForm({ plant, onSaved, onCancel }: PlantFormProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(plant);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      name: '',
      scientificName: '',
      description: '',
      isActive: true,
      isFeatured: false,
      plantClass: '',
      series: '',
      placeOfOrigin: '',
      auraType: '',
      biodiversityBooster: false,
      carbonAbsorber: false,
      temperatureMin: undefined,
      temperatureMax: undefined,
      categoryId: '',
      soil: [],
      repotting: [],
      maintenance: [],
      insideBox: [],
      benefits: [],
      spiritualUseCase: [],
      bestForEmotion: [],
      bestGiftFor: [],
      funFacts: [],
      associatedDeity: '',
      godAligned: '',
      ...plant,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PlantFormData) => {
      const response = await axios.post('/api/plants', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant created successfully');
      onSaved?.();
    },
    onError: () => {
      showErrorToast('Failed to create plant');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PlantFormData) => {
      const response = await axios.put(`/api/plants/${plant.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant updated successfully');
      onSaved?.();
    },
    onError: () => {
      showErrorToast('Failed to update plant');
    },
  });

  const onSubmit = (data: PlantFormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Options for dropdowns
  const plantClassOptions = [
    { value: 'Flowering', label: 'Flowering' },
    { value: 'Non-Flowering', label: 'Non-Flowering' },
  ];

  const auraTypeOptions = [
    { value: 'Positive', label: 'Positive' },
    { value: 'Neutral', label: 'Neutral' },
    { value: 'Calming', label: 'Calming' },
  ];

  const soilOptions = [
    { value: 'Clay', label: 'Clay' },
    { value: 'Sandy', label: 'Sandy' },
    { value: 'Loamy', label: 'Loamy' },
    { value: 'Well-drained', label: 'Well-drained' },
  ];

  const repottingOptions = [
    { value: 'Annual', label: 'Annual' },
    { value: 'Bi-annual', label: 'Bi-annual' },
    { value: 'As needed', label: 'As needed' },
  ];

  const maintenanceOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Box>
        <Typography variant="h6" className="mb-4">Basic Information</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Plant Name"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  data-testid="input-plant-name"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="scientificName"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Scientific Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  data-testid="input-scientific-name"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  data-testid="input-description"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Status Toggles */}
      <Box>
        <Typography variant="h6" className="mb-4">Status</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Is Active"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="isFeatured"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Is Featured"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Plant Details */}
      <Box>
        <Typography variant="h6" className="mb-4">Plant Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Controller
              name="plantClass"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>Plant Class</InputLabel>
                  <Select {...field} label="Plant Class">
                    {plantClassOptions.map((option) => (
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
              name="series"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Series"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="placeOfOrigin"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Place of Origin"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Environmental & Aura */}
      <Box>
        <Typography variant="h6" className="mb-4">Environmental & Aura</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Controller
              name="auraType"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>Aura Type</InputLabel>
                  <Select {...field} label="Aura Type">
                    {auraTypeOptions.map((option) => (
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
              name="biodiversityBooster"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Biodiversity Booster"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller
              name="carbonAbsorber"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Carbon Absorber"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Temperature */}
      <Box>
        <Typography variant="h6" className="mb-4">Temperature Range</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="temperatureMin"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Min Temperature (°C)"
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
              name="temperatureMax"
              control={form.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Max Temperature (°C)"
                  type="number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Category */}
      <Box>
        <Typography variant="h6" className="mb-4">Category</Typography>
        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel>Category</InputLabel>
              <Select {...field} label="Category">
                {categories.map((category: any) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      {/* Multi-select fields */}
      <Box>
        <Typography variant="h6" className="mb-4">Care Requirements</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="soil"
              control={form.control}
              render={({ field }) => (
                <MultiSelect
                  options={soilOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select soil types..."
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="repotting"
              control={form.control}
              render={({ field }) => (
                <MultiSelect
                  options={repottingOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select repotting schedule..."
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Form Actions */}
      <Box className="flex justify-end space-x-4 pt-6 border-t">
        <Button 
          type="button" 
          onClick={onCancel}
          variant="outlined"
          data-testid="button-cancel"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="contained"
          disabled={isPending}
          data-testid="button-save"
        >
          {isPending ? 'Saving...' : isEdit ? 'Update Plant' : 'Save Plant'}
        </Button>
      </Box>
    </form>
  );
}
