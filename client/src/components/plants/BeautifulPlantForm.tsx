import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plantFormSchema, type PlantFormData } from '@/validation/plantSchemas';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import { X, Upload, Info, Star, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface BeautifulPlantFormProps {
  plant?: any;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function BeautifulPlantForm({ plant, onSaved, onCancel }: BeautifulPlantFormProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(plant);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  const form = useForm({
    defaultValues: {
      name: '',
      scientificName: '',
      description: '',
      isActive: true,
      isFeatured: false,
      plantClass: '',
      categoryId: '',
      temperatureMin: undefined,
      temperatureMax: undefined,
      price: 0,
      cost: 0,
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
      showSuccessToast('Plant created successfully! 🌱');
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
      showSuccessToast('Plant updated successfully! 🌿');
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

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Details & Classification';
      case 3: return 'Pricing & Settings';
      default: return 'Plant Information';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEdit ? 'Edit Plant' : 'Add New Plant'}
              </h2>
              <p className="text-green-100">
                {getStepTitle()} • Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-2 border-green-100">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Plant Name *</Label>
                        <Controller
                          name="name"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <div>
                              <Input
                                {...field}
                                placeholder="e.g., Monstera Deliciosa"
                                className="h-12 border-2 focus:border-green-400 rounded-xl"
                              />
                              {fieldState.error && (
                                <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Scientific Name</Label>
                        <Controller
                          name="scientificName"
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="e.g., Monstera deliciosa"
                              className="h-12 border-2 focus:border-green-400 rounded-xl"
                            />
                          )}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Description</Label>
                        <Controller
                          name="description"
                          control={form.control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              placeholder="Describe this beautiful plant..."
                              className="border-2 focus:border-green-400 rounded-xl min-h-[100px] resize-none"
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Category</Label>
                        <Controller
                          name="categoryId"
                          control={form.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 border-2 focus:border-green-400 rounded-xl">
                                <SelectValue placeholder="Select a category" />
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
                        <Label className="text-sm font-semibold text-gray-700">Plant Class</Label>
                        <Controller
                          name="plantClass"
                          control={form.control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-12 border-2 focus:border-green-400 rounded-xl">
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Details & Classification */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-2 border-green-100">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          <span className="flex items-center gap-2">
                            Temperature Range (°C)
                            <Info className="w-4 h-4 text-gray-400" />
                          </span>
                        </Label>
                        <div className="flex space-x-3">
                          <Controller
                            name="temperatureMin"
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                placeholder="Min"
                                className="h-12 border-2 focus:border-green-400 rounded-xl"
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
                                className="h-12 border-2 focus:border-green-400 rounded-xl"
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Special Features</Label>
                        <div className="flex flex-wrap gap-3">
                          <Controller
                            name="isFeatured"
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2 bg-amber-50 p-3 rounded-lg border">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <Label className="text-sm flex items-center gap-1">
                                  <Star className="w-4 h-4 text-amber-500" />
                                  Featured Plant
                                </Label>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Pricing & Settings */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <Card className="border-2 border-green-100">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Selling Price (₹)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-12 border-2 focus:border-green-400 rounded-xl text-lg"
                          value={form.watch('price') || 0}
                          onChange={(e) => form.setValue('price', Number(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Cost Price (₹)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="h-12 border-2 focus:border-green-400 rounded-xl text-lg"
                          value={form.watch('cost') || 0}
                          onChange={(e) => form.setValue('cost', Number(e.target.value))}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <Label className="text-sm font-semibold text-gray-700">Status</Label>
                        <div className="flex items-center space-x-2 bg-green-50 p-4 rounded-lg border">
                          <Controller
                            name="isActive"
                            control={form.control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label className="text-sm">
                            Active (Available for sale)
                          </Label>
                          {form.watch('isActive') && (
                            <Badge className="bg-green-100 text-green-800">
                              Live
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="px-6 py-2 border-2 hover:border-green-400"
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                  >
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                      </div>
                    ) : (
                      <span>{isEdit ? 'Update Plant' : 'Create Plant'}</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}