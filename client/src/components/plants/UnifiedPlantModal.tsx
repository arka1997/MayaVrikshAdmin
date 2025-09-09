import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  X, Plus, Save, Trash2, Droplets, Sun, Palette, Ruler, 
  Leaf, ChevronRight, ChevronDown, Edit3, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

interface UnifiedPlantModalProps {
  plant?: any;
  mode: 'create' | 'edit' | 'variants';
  onClose: () => void;
}

interface FertilizerSchedule {
  fertilizerId: string;
  applicationFrequency: string;
  amount?: string;
  notes?: string;
}

interface SeasonalCare {
  season: string;
  wateringFrequency: string;
  amount_ml: number;
  sunlightTypeId: string;
  temperature: string;
  humidity: string;
  fertilizerSchedule: FertilizerSchedule[];
}

interface ColorVariant {
  colorId: string;
  sku: string;
  imageUrl?: string;
  name: string;
  hexCode: string;
  description?: string;
}

interface SizeProfile {
  size: string;
  height?: number;
  weight?: number;
  seasonalCare: SeasonalCare[];
  variants: ColorVariant[];
}

export function UnifiedPlantModal({ plant, mode, onClose }: UnifiedPlantModalProps) {
  const queryClient = useQueryClient();
  const isEdit = mode === 'edit';
  const isVariants = mode === 'variants';
  
  const [activeSection, setActiveSection] = useState<'basic' | 'variants'>('basic');
  const [sizeProfiles, setSizeProfiles] = useState<SizeProfile[]>([
    {
      size: 'Small',
      seasonalCare: [
        {
          season: 'Summer',
          wateringFrequency: '',
          amount_ml: 0,
          sunlightTypeId: '',
          temperature: '',
          humidity: '',
          fertilizerSchedule: []
        }
      ],
      variants: []
    }
  ]);

  const [expandedSizes, setExpandedSizes] = useState<{ [key: string]: boolean }>({ 'Small': true });
  const [expandedSeasons, setExpandedSeasons] = useState<{ [key: string]: boolean }>({});

  // Fetch categories and other data
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  const { data: fertilizers = [] } = useQuery({
    queryKey: ['fertilizers'],
    queryFn: async () => {
      const response = await axios.get('/api/fertilizers');
      return response.data;
    },
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
      sizeProfiles: [],
      ...plant,
    },
  });

  // Initialize data if editing
  useEffect(() => {
    if (plant && (isEdit || isVariants)) {
      // Load existing size profiles or create default
      if (plant.sizeProfiles && plant.sizeProfiles.length > 0) {
        setSizeProfiles(plant.sizeProfiles);
      }
      if (isVariants) {
        setActiveSection('variants');
      }
    }
  }, [plant, isEdit, isVariants]);

  const createPlantMutation = useMutation({
    mutationFn: async (data: any) => {
      const plantData = {
        ...data,
        sizeProfiles: sizeProfiles
      };
      const response = await axios.post('/api/plants', plantData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant created successfully! 🌱');
      onClose();
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create plant');
    },
  });

  const updatePlantMutation = useMutation({
    mutationFn: async (data: any) => {
      const plantData = {
        ...data,
        sizeProfiles: sizeProfiles
      };
      const response = await axios.put(`/api/plants/${plant.id}`, plantData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant updated successfully! 🌿');
      onClose();
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

  // Size Profile Management
  const addSizeProfile = () => {
    const newSize = sizeProfiles.length === 0 ? 'Small' : 
                   sizeProfiles.length === 1 ? 'Medium' : 'Large';
    setSizeProfiles([...sizeProfiles, {
      size: newSize,
      seasonalCare: [{
        season: 'Summer',
        wateringFrequency: '',
        amount_ml: 0,
        sunlightTypeId: '',
        temperature: '',
        humidity: '',
        fertilizerSchedule: []
      }],
      variants: []
    }]);
    setExpandedSizes({ ...expandedSizes, [newSize]: true });
  };

  const updateSizeProfile = (sizeIndex: number, field: keyof SizeProfile, value: any) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex] = { ...updated[sizeIndex], [field]: value };
    setSizeProfiles(updated);
  };

  const addSeasonalCare = (sizeIndex: number) => {
    const updated = [...sizeProfiles];
    const existingSeasons = updated[sizeIndex].seasonalCare.map(care => care.season);
    const availableSeasons = ['Summer', 'Winter', 'Monsoon'].filter(s => !existingSeasons.includes(s));
    
    if (availableSeasons.length > 0) {
      updated[sizeIndex].seasonalCare.push({
        season: availableSeasons[0],
        wateringFrequency: '',
        amount_ml: 0,
        sunlightTypeId: '',
        temperature: '',
        humidity: '',
        fertilizerSchedule: []
      });
      setSizeProfiles(updated);
    }
  };

  const updateSeasonalCare = (sizeIndex: number, careIndex: number, field: keyof SeasonalCare, value: any) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex].seasonalCare[careIndex] = { 
      ...updated[sizeIndex].seasonalCare[careIndex], 
      [field]: value 
    };
    setSizeProfiles(updated);
  };

  const addFertilizer = (sizeIndex: number, careIndex: number) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex].seasonalCare[careIndex].fertilizerSchedule.push({
      fertilizerId: '',
      applicationFrequency: '',
      amount: '',
      notes: ''
    });
    setSizeProfiles(updated);
  };

  const updateFertilizer = (sizeIndex: number, careIndex: number, fertIndex: number, field: keyof FertilizerSchedule, value: any) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex].seasonalCare[careIndex].fertilizerSchedule[fertIndex] = {
      ...updated[sizeIndex].seasonalCare[careIndex].fertilizerSchedule[fertIndex],
      [field]: value
    };
    setSizeProfiles(updated);
  };

  const removeFertilizer = (sizeIndex: number, careIndex: number, fertIndex: number) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex].seasonalCare[careIndex].fertilizerSchedule.splice(fertIndex, 1);
    setSizeProfiles(updated);
  };

  const addColorVariant = (sizeIndex: number) => {
    const updated = [...sizeProfiles];
    const variantCount = updated[sizeIndex].variants.length;
    updated[sizeIndex].variants.push({
      colorId: `color-${Date.now()}`,
      sku: `${form.watch('name')?.substring(0, 4).toUpperCase() || 'PLANT'}-${updated[sizeIndex].size.charAt(0)}-${variantCount + 1}`,
      name: '',
      hexCode: '#4CAF50',
      description: ''
    });
    setSizeProfiles(updated);
  };

  const updateColorVariant = (sizeIndex: number, variantIndex: number, field: keyof ColorVariant, value: any) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex].variants[variantIndex] = {
      ...updated[sizeIndex].variants[variantIndex],
      [field]: value
    };
    setSizeProfiles(updated);
  };

  const removeColorVariant = (sizeIndex: number, variantIndex: number) => {
    const updated = [...sizeProfiles];
    updated[sizeIndex].variants.splice(variantIndex, 1);
    setSizeProfiles(updated);
  };

  const toggleSizeExpanded = (size: string) => {
    setExpandedSizes({ ...expandedSizes, [size]: !expandedSizes[size] });
  };

  const toggleSeasonExpanded = (key: string) => {
    setExpandedSeasons({ ...expandedSeasons, [key]: !expandedSeasons[key] });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              {isVariants ? <Sparkles className="w-8 h-8" /> : <Leaf className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                {isVariants ? 'Plant Variants' : isEdit ? 'Edit Plant' : 'Create New Plant'}
              </h2>
              <p className="text-green-100 text-lg">
                {isVariants 
                  ? `Manage variants for ${plant?.name || 'plant'}`
                  : isEdit 
                  ? 'Update plant information and variants'
                  : 'Add a new plant with complete variant details'
                }
              </p>
            </div>
          </div>

          {/* Section Toggle */}
          {!isVariants && (
            <div className="flex mt-6 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveSection('basic')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'basic' ? 'bg-white text-green-600' : 'text-white hover:bg-white/20'
                }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveSection('variants')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'variants' ? 'bg-white text-green-600' : 'text-white hover:bg-white/20'
                }`}
              >
                Size Profiles & Variants
              </button>
            </div>
          )}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[calc(95vh-200px)]">
          <div className="flex-1 overflow-y-auto">
            {/* Basic Information Section */}
            {(activeSection === 'basic' || isVariants) && !isVariants && (
              <div className="p-8 space-y-6">
                <Card className="border-2 border-green-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <span>Plant Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Plant Name *</Label>
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., Monstera Deliciosa"
                            className="h-12 border-2 focus:border-green-400 rounded-xl"
                          />
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
                            className="border-2 focus:border-green-400 rounded-xl min-h-[100px]"
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

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-12 border-2 focus:border-green-400 rounded-xl"
                        value={form.watch('price') || 0}
                        onChange={(e) => form.setValue('price', Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Cost (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-12 border-2 focus:border-green-400 rounded-xl"
                        value={form.watch('cost') || 0}
                        onChange={(e) => form.setValue('cost', Number(e.target.value))}
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center space-x-4">
                      <Controller
                        name="isActive"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <Label>Active</Label>
                          </div>
                        )}
                      />
                      <Controller
                        name="isFeatured"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <Label>Featured</Label>
                          </div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Size Profiles & Variants Section */}
            {(activeSection === 'variants' || isVariants) && (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">Size Profiles & Variants</h3>
                  <Button
                    type="button"
                    onClick={addSizeProfile}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size Profile
                  </Button>
                </div>

                {sizeProfiles.map((sizeProfile, sizeIndex) => (
                  <Card key={sizeIndex} className="border-2 border-green-100">
                    <Collapsible
                      open={expandedSizes[sizeProfile.size]}
                      onOpenChange={() => toggleSizeExpanded(sizeProfile.size)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="hover:bg-gray-50 transition-colors">
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Ruler className="w-5 h-5 text-green-600" />
                              <span>{sizeProfile.size} Size Profile</span>
                              <Badge variant="outline">
                                {sizeProfile.seasonalCare.length} seasons • {sizeProfile.variants.length} variants
                              </Badge>
                            </div>
                            {expandedSizes[sizeProfile.size] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="space-y-6">
                          {/* Size Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                              <Label>Size</Label>
                              <Select
                                value={sizeProfile.size}
                                onValueChange={(value) => updateSizeProfile(sizeIndex, 'size', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Small">Small</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Large">Large</SelectItem>
                                  <SelectItem value="XL">Extra Large</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Height (cm)</Label>
                              <Input
                                type="number"
                                value={sizeProfile.height || ''}
                                onChange={(e) => updateSizeProfile(sizeIndex, 'height', Number(e.target.value))}
                                placeholder="Height"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Weight (kg)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={sizeProfile.weight || ''}
                                onChange={(e) => updateSizeProfile(sizeIndex, 'weight', Number(e.target.value))}
                                placeholder="Weight"
                              />
                            </div>
                          </div>

                          {/* Seasonal Care */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold flex items-center space-x-2">
                                <Sun className="w-5 h-5 text-orange-500" />
                                <span>Seasonal Care</span>
                              </h4>
                              <Button
                                type="button"
                                onClick={() => addSeasonalCare(sizeIndex)}
                                size="sm"
                                variant="outline"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Season
                              </Button>
                            </div>

                            {sizeProfile.seasonalCare.map((care, careIndex) => {
                              const seasonKey = `${sizeIndex}-${careIndex}-${care.season}`;
                              return (
                                <Card key={careIndex} className="border border-orange-200">
                                  <Collapsible
                                    open={expandedSeasons[seasonKey]}
                                    onOpenChange={() => toggleSeasonExpanded(seasonKey)}
                                  >
                                    <CollapsibleTrigger className="w-full">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center justify-between text-base">
                                          <span className="flex items-center space-x-2">
                                            <Sun className="w-4 h-4 text-orange-500" />
                                            <span>{care.season} Care</span>
                                          </span>
                                          {expandedSeasons[seasonKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </CardTitle>
                                      </CardHeader>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label>Season</Label>
                                            <Select
                                              value={care.season}
                                              onValueChange={(value) => updateSeasonalCare(sizeIndex, careIndex, 'season', value)}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Summer">Summer</SelectItem>
                                                <SelectItem value="Winter">Winter</SelectItem>
                                                <SelectItem value="Monsoon">Monsoon</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Watering Frequency</Label>
                                            <Input
                                              placeholder="e.g., Every 3 days"
                                              value={care.wateringFrequency}
                                              onChange={(e) => updateSeasonalCare(sizeIndex, careIndex, 'wateringFrequency', e.target.value)}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Water Amount (ml)</Label>
                                            <Input
                                              type="number"
                                              placeholder="120"
                                              value={care.amount_ml}
                                              onChange={(e) => updateSeasonalCare(sizeIndex, careIndex, 'amount_ml', Number(e.target.value))}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Sunlight Type</Label>
                                            <Select
                                              value={care.sunlightTypeId}
                                              onValueChange={(value) => updateSeasonalCare(sizeIndex, careIndex, 'sunlightTypeId', value)}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select sunlight" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="sunlight-direct-001">Direct Sunlight</SelectItem>
                                                <SelectItem value="sunlight-indirect-001">Indirect Sunlight</SelectItem>
                                                <SelectItem value="sunlight-partial-001">Partial Shade</SelectItem>
                                                <SelectItem value="sunlight-shade-001">Full Shade</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>

                                        {/* Fertilizer Schedule */}
                                        <div className="space-y-4 border-t pt-4">
                                          <div className="flex items-center justify-between">
                                            <h5 className="font-medium flex items-center space-x-2">
                                              <Droplets className="w-4 h-4 text-blue-500" />
                                              <span>Fertilizer Schedule</span>
                                            </h5>
                                            <Button
                                              type="button"
                                              onClick={() => addFertilizer(sizeIndex, careIndex)}
                                              size="sm"
                                              variant="outline"
                                            >
                                              <Plus className="w-3 h-3 mr-1" />
                                              Add Fertilizer
                                            </Button>
                                          </div>

                                          {care.fertilizerSchedule.map((fert, fertIndex) => (
                                            <div key={fertIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg items-end">
                                              <div className="space-y-1">
                                                <Label className="text-xs">Fertilizer</Label>
                                                <Select
                                                  value={fert.fertilizerId}
                                                  onValueChange={(value) => updateFertilizer(sizeIndex, careIndex, fertIndex, 'fertilizerId', value)}
                                                >
                                                  <SelectTrigger className="h-9">
                                                    <SelectValue placeholder="Select fertilizer" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {fertilizers.map((fertilizer: any) => (
                                                      <SelectItem key={fertilizer.id} value={fertilizer.id}>
                                                        {fertilizer.name}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs">Frequency</Label>
                                                <Input
                                                  className="h-9"
                                                  placeholder="Monthly"
                                                  value={fert.applicationFrequency}
                                                  onChange={(e) => updateFertilizer(sizeIndex, careIndex, fertIndex, 'applicationFrequency', e.target.value)}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs">Amount</Label>
                                                <Input
                                                  className="h-9"
                                                  placeholder="5ml"
                                                  value={fert.amount}
                                                  onChange={(e) => updateFertilizer(sizeIndex, careIndex, fertIndex, 'amount', e.target.value)}
                                                />
                                              </div>
                                              <Button
                                                type="button"
                                                onClick={() => removeFertilizer(sizeIndex, careIndex, fertIndex)}
                                                size="sm"
                                                variant="outline"
                                                className="h-9 text-red-600"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </Card>
                              );
                            })}
                          </div>

                          {/* Color Variants */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold flex items-center space-x-2">
                                <Palette className="w-5 h-5 text-purple-500" />
                                <span>Color Variants</span>
                              </h4>
                              <Button
                                type="button"
                                onClick={() => addColorVariant(sizeIndex)}
                                size="sm"
                                variant="outline"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Color
                              </Button>
                            </div>

                            {sizeProfile.variants.map((variant, variantIndex) => (
                              <div key={variantIndex} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-purple-200 rounded-lg items-end">
                                <div className="space-y-2">
                                  <Label>Color Name</Label>
                                  <Input
                                    placeholder="e.g., Variegated Green"
                                    value={variant.name}
                                    onChange={(e) => updateColorVariant(sizeIndex, variantIndex, 'name', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Color</Label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="color"
                                      value={variant.hexCode}
                                      onChange={(e) => updateColorVariant(sizeIndex, variantIndex, 'hexCode', e.target.value)}
                                      className="w-10 h-9 border rounded cursor-pointer"
                                    />
                                    <Input
                                      value={variant.hexCode}
                                      onChange={(e) => updateColorVariant(sizeIndex, variantIndex, 'hexCode', e.target.value)}
                                      className="flex-1"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>SKU</Label>
                                  <Input
                                    placeholder="AUTO-GENERATED"
                                    value={variant.sku}
                                    onChange={(e) => updateColorVariant(sizeIndex, variantIndex, 'sku', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Input
                                    placeholder="Brief description"
                                    value={variant.description}
                                    onChange={(e) => updateColorVariant(sizeIndex, variantIndex, 'description', e.target.value)}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => removeColorVariant(sizeIndex, variantIndex)}
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-8 py-6">
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-2"
              >
                Cancel
              </Button>
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
                  <span>
                    <Save className="w-4 h-4 mr-2 inline" />
                    {isEdit ? 'Update Plant' : 'Create Plant'}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}