import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { X, Plus, Save, Trash2, Droplets, Sun, Palette, Ruler, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

interface BeautifulVariantModalProps {
  plantId: string;
  plantName: string;
  onClose: () => void;
}

interface SizeProfile {
  id?: string;
  size: string;
  height: number;
  weight: number;
}

interface SeasonalCare {
  id?: string;
  season: string;
  wateringFrequency: string;
  waterAmount: string;
  sunlight: string;
  humidity: string;
  fertilizers: FertilizerSchedule[];
}

interface FertilizerSchedule {
  id?: string;
  name: string;
  frequency: string;
  amount: string;
}

interface ColorVariant {
  id?: string;
  name: string;
  hexCode: string;
  description: string;
}

export function BeautifulVariantModal({ plantId, plantName, onClose }: BeautifulVariantModalProps) {
  const [activeTab, setActiveTab] = useState('sizes');
  const [sizeProfiles, setSizeProfiles] = useState<SizeProfile[]>([
    { size: 'Small', height: 0, weight: 0 }
  ]);
  const [seasonalCare, setSeasonalCare] = useState<SeasonalCare[]>([
    {
      season: 'Summer',
      wateringFrequency: '',
      waterAmount: '',
      sunlight: '',
      humidity: '',
      fertilizers: []
    }
  ]);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [selectedSeason, setSelectedSeason] = useState('Summer');

  // Mutations for saving data
  const saveSizeProfileMutation = useMutation({
    mutationFn: async (profile: SizeProfile) => {
      const response = await axios.post('/api/size-profiles', {
        plantId,
        ...profile
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast('Size profile saved successfully! 📏');
    },
    onError: () => {
      showErrorToast('Failed to save size profile');
    }
  });

  const saveSeasonalCareMutation = useMutation({
    mutationFn: async (care: SeasonalCare) => {
      const response = await axios.post('/api/care-guidelines', {
        plantId,
        ...care
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast(`${selectedSeason} care saved successfully! 🌱`);
    },
    onError: () => {
      showErrorToast('Failed to save seasonal care');
    }
  });

  const saveColorVariantsMutation = useMutation({
    mutationFn: async (variants: ColorVariant[]) => {
      const promises = variants.map(variant => 
        axios.post('/api/plant-variants', {
          plantId,
          ...variant
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      showSuccessToast('Color variants saved successfully! 🎨');
    },
    onError: () => {
      showErrorToast('Failed to save color variants');
    }
  });

  const addSizeProfile = () => {
    setSizeProfiles([...sizeProfiles, { size: 'Medium', height: 0, weight: 0 }]);
  };

  const updateSizeProfile = (index: number, field: keyof SizeProfile, value: any) => {
    const updated = [...sizeProfiles];
    updated[index] = { ...updated[index], [field]: value };
    setSizeProfiles(updated);
  };

  const removeSizeProfile = (index: number) => {
    setSizeProfiles(sizeProfiles.filter((_, i) => i !== index));
  };

  const addColorVariant = () => {
    setColorVariants([...colorVariants, { name: '', hexCode: '#4CAF50', description: '' }]);
  };

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: any) => {
    const updated = [...colorVariants];
    updated[index] = { ...updated[index], [field]: value };
    setColorVariants(updated);
  };

  const removeColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  const updateSeasonalCare = (field: keyof SeasonalCare, value: any) => {
    const currentCare = seasonalCare.find(care => care.season === selectedSeason);
    if (currentCare) {
      const updated = seasonalCare.map(care => 
        care.season === selectedSeason 
          ? { ...care, [field]: value }
          : care
      );
      setSeasonalCare(updated);
    } else {
      setSeasonalCare([...seasonalCare, {
        season: selectedSeason,
        wateringFrequency: '',
        waterAmount: '',
        sunlight: '',
        humidity: '',
        fertilizers: [],
        [field]: value
      }]);
    }
  };

  const addFertilizer = () => {
    const currentCare = seasonalCare.find(care => care.season === selectedSeason);
    if (currentCare) {
      updateSeasonalCare('fertilizers', [
        ...currentCare.fertilizers,
        { name: '', frequency: '', amount: '' }
      ]);
    }
  };

  const getCurrentSeasonalCare = () => {
    return seasonalCare.find(care => care.season === selectedSeason) || {
      season: selectedSeason,
      wateringFrequency: '',
      waterAmount: '',
      sunlight: '',
      humidity: '',
      fertilizers: []
    };
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
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
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Plant Variants</h2>
              <p className="text-green-100 text-lg">
                Configure variants for <span className="font-semibold">{plantName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
              <TabsTrigger 
                value="sizes" 
                className="flex items-center space-x-2 py-4 text-base font-medium data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
              >
                <Ruler className="w-5 h-5" />
                <span>Size Profiles</span>
              </TabsTrigger>
              <TabsTrigger 
                value="care" 
                className="flex items-center space-x-2 py-4 text-base font-medium data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
              >
                <Sun className="w-5 h-5" />
                <span>Seasonal Care</span>
              </TabsTrigger>
              <TabsTrigger 
                value="colors" 
                className="flex items-center space-x-2 py-4 text-base font-medium data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-green-500"
              >
                <Palette className="w-5 h-5" />
                <span>Color Variants</span>
              </TabsTrigger>
            </TabsList>

            {/* Size Profiles Tab */}
            <TabsContent value="sizes" className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Size Profiles</h3>
                  <Button
                    onClick={addSizeProfile}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size
                  </Button>
                </div>

                <div className="grid gap-4">
                  {sizeProfiles.map((profile, index) => (
                    <Card key={index} className="border-2 border-green-100 hover:border-green-300 transition-colors">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="space-y-2">
                            <Label className="font-medium">Size</Label>
                            <Select
                              value={profile.size}
                              onValueChange={(value) => updateSizeProfile(index, 'size', value)}
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
                            <Label className="font-medium">Height (cm)</Label>
                            <Input
                              type="number"
                              value={profile.height}
                              onChange={(e) => updateSizeProfile(index, 'height', Number(e.target.value))}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="font-medium">Weight (kg)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={profile.weight}
                              onChange={(e) => updateSizeProfile(index, 'weight', Number(e.target.value))}
                              placeholder="0.0"
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => saveSizeProfileMutation.mutate(profile)}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                              disabled={saveSizeProfileMutation.isPending}
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              onClick={() => removeSizeProfile(index)}
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Seasonal Care Tab */}
            <TabsContent value="care" className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Seasonal Care Instructions</h3>
                  <div className="flex space-x-2">
                    {['Summer', 'Winter', 'Monsoon'].map((season) => (
                      <Button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        variant={selectedSeason === season ? "default" : "outline"}
                        className={selectedSeason === season ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {season}
                      </Button>
                    ))}
                  </div>
                </div>

                <Card className="border-2 border-green-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sun className="w-5 h-5 text-orange-500" />
                      <span>{selectedSeason} Care for {sizeProfiles[0]?.size || 'Small'} Size</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span>Watering Frequency</span>
                        </Label>
                        <Input
                          placeholder="e.g., Every 3 days"
                          value={getCurrentSeasonalCare().wateringFrequency}
                          onChange={(e) => updateSeasonalCare('wateringFrequency', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Water Amount (ml)</Label>
                        <Input
                          placeholder="e.g., 250"
                          value={getCurrentSeasonalCare().waterAmount}
                          onChange={(e) => updateSeasonalCare('waterAmount', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Sunlight Requirements</Label>
                        <Select
                          value={getCurrentSeasonalCare().sunlight}
                          onValueChange={(value) => updateSeasonalCare('sunlight', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sunlight type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Direct">Direct Sunlight</SelectItem>
                            <SelectItem value="Indirect">Indirect Sunlight</SelectItem>
                            <SelectItem value="Partial">Partial Shade</SelectItem>
                            <SelectItem value="Shade">Full Shade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Humidity Level</Label>
                        <Select
                          value={getCurrentSeasonalCare().humidity}
                          onValueChange={(value) => updateSeasonalCare('humidity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select humidity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High (60-80%)</SelectItem>
                            <SelectItem value="Medium">Medium (40-60%)</SelectItem>
                            <SelectItem value="Low">Low (20-40%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => saveSeasonalCareMutation.mutate(getCurrentSeasonalCare())}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        disabled={saveSeasonalCareMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save {selectedSeason} Care
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Color Variants Tab */}
            <TabsContent value="colors" className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Color Variants</h3>
                  <Button
                    onClick={addColorVariant}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color Variant
                  </Button>
                </div>

                <div className="grid gap-4">
                  {colorVariants.map((variant, index) => (
                    <Card key={index} className="border-2 border-green-100 hover:border-green-300 transition-colors">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                          <div className="space-y-2">
                            <Label className="font-medium">Variant Name</Label>
                            <Input
                              placeholder="e.g., Variegated"
                              value={variant.name}
                              onChange={(e) => updateColorVariant(index, 'name', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="font-medium">Color</Label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={variant.hexCode}
                                onChange={(e) => updateColorVariant(index, 'hexCode', e.target.value)}
                                className="w-12 h-10 border rounded cursor-pointer"
                              />
                              <Input
                                value={variant.hexCode}
                                onChange={(e) => updateColorVariant(index, 'hexCode', e.target.value)}
                                placeholder="#4CAF50"
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2 space-y-2">
                            <Label className="font-medium">Description</Label>
                            <Input
                              placeholder="Describe this color variant..."
                              value={variant.description}
                              onChange={(e) => updateColorVariant(index, 'description', e.target.value)}
                            />
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => removeColorVariant(index)}
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {colorVariants.length > 0 && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => saveColorVariantsMutation.mutate(colorVariants)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        disabled={saveColorVariantsMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save All Variants
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}