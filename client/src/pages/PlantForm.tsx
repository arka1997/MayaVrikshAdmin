import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Leaf, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

export default function PlantForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const plantId = searchParams.get('plantId');
  const isEdit = Boolean(plantId);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  const { data: plant } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      if (!plantId) return null;
      const response = await axios.get(`/api/plants/${plantId}`);
      return response.data;
    },
    enabled: Boolean(plantId),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      scientificName: '',
      description: '',
      categoryId: '',
      plantClass: '',
      isActive: true,
      isFeatured: false,
      temperatureMin: undefined,
      temperatureMax: undefined,
      price: 0,
      cost: 0,
    },
  });

  useEffect(() => {
    if (plant && isEdit) {
      form.reset(plant);
    }
  }, [plant, isEdit, form]);

  const createPlantMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/plants', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant created successfully! 🌱');
      navigate('/plants');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create plant');
    },
  });

  const updatePlantMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(`/api/plants/${plantId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant updated successfully! 🌿');
      navigate('/plants');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to update plant');
    },
  });

  const onSubmit = (data: any) => {
    if (isEdit) {
      updatePlantMutation.mutate(data);
    } else {
      createPlantMutation.mutate(data);
    }
  };

  const isPending = createPlantMutation.isPending || updatePlantMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/plants')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Plants</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Edit Plant' : 'Add New Plant'}
                  </h1>
                  <p className="text-gray-600">
                    {isEdit ? 'Update plant information' : 'Create a new plant entry'}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/plant-variants?plantId=${plantId || 'new'}`)}
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              disabled={!isEdit}
            >
              Manage Variants
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Plant Name *</Label>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder="e.g., Monstera Deliciosa"
                          className="h-11"
                        />
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Scientific Name</Label>
                  <Controller
                    name="scientificName"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., Monstera deliciosa"
                        className="h-11"
                      />
                    )}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe this beautiful plant..."
                        className="min-h-[100px] resize-none"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Plant Class</Label>
                  <Controller
                    name="plantClass"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select plant class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flowering">Flowering</SelectItem>
                          <SelectItem value="Non-Flowering">Non-Flowering</SelectItem>
                          <SelectItem value="Succulent">Succulent</SelectItem>
                          <SelectItem value="Tropical">Tropical</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Temperature Range (°C)</Label>
                  <div className="flex space-x-3">
                    <Controller
                      name="temperatureMin"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Min"
                          className="h-11"
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      )}
                    />
                    <div className="flex items-center">
                      <span className="text-gray-400">to</span>
                    </div>
                    <Controller
                      name="temperatureMax"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Max"
                          className="h-11"
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Selling Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-11 text-lg"
                    value={form.watch('price') || 0}
                    onChange={(e) => form.setValue('price', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Cost Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-11 text-lg"
                    value={form.watch('cost') || 0}
                    onChange={(e) => form.setValue('cost', Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Active Status</Label>
                    <p className="text-sm text-gray-500">Make this plant available for sale</p>
                  </div>
                  <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Featured Plant</Label>
                    <p className="text-sm text-gray-500">Highlight this plant in featured sections</p>
                  </div>
                  <Controller
                    name="isFeatured"
                    control={form.control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/plants')}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 bg-green-600 hover:bg-green-700 text-white"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Update Plant' : 'Save Plant'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
