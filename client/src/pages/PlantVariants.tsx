import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Save, Plus, Trash2, Droplets, Sun, Palette, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

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
  humidity: string;
  fertilizerSchedule: FertilizerSchedule[];
}

interface ColorVariant {
  colorId: string;
  sku: string;
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

export default function PlantVariants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const plantId = searchParams.get('plantId');
  
  const [selectedSize, setSelectedSize] = useState('Small');
  const [activeSeasonTab, setActiveSeasonTab] = useState('Summer');
  const [sizeProfiles, setSizeProfiles] = useState<SizeProfile[]>([
    {
      size: 'Small',
      seasonalCare: [
        {
          season: 'Summer',
          wateringFrequency: '',
          amount_ml: 0,
          sunlightTypeId: '',
          humidity: '',
          fertilizerSchedule: []
        }
      ],
      variants: []
    }
  ]);

  const { data: plant } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      if (!plantId || plantId === 'new') return null;
      const response = await axios.get(`/api/plants/${plantId}`);
      return response.data;
    },
    enabled: Boolean(plantId && plantId !== 'new'),
  });

  const { data: fertilizers = [] } = useQuery({
    queryKey: ['fertilizers'],
    queryFn: async () => {
      const response = await axios.get('/api/fertilizers');
      return response.data;
    },
  });

  useEffect(() => {
    if (plant && plant.sizeProfiles && plant.sizeProfiles.length > 0) {
      setSizeProfiles(plant.sizeProfiles);
      setSelectedSize(plant.sizeProfiles[0].size);
    }
  }, [plant]);

  const getCurrentSizeProfile = () => {
    return sizeProfiles.find(profile => profile.size === selectedSize) || sizeProfiles[0];
  };

  const getCurrentSeasonalCare = () => {
    const profile = getCurrentSizeProfile();
    return profile?.seasonalCare.find(care => care.season === activeSeasonTab) || {
      season: activeSeasonTab,
      wateringFrequency: '',
      amount_ml: 0,
      sunlightTypeId: '',
      humidity: '',
      fertilizerSchedule: []
    };
  };

  const updateSeasonalCare = (field: keyof SeasonalCare, value: any) => {
    const updated = [...sizeProfiles];
    const sizeIndex = updated.findIndex(profile => profile.size === selectedSize);
    
    if (sizeIndex !== -1) {
      const careIndex = updated[sizeIndex].seasonalCare.findIndex(care => care.season === activeSeasonTab);
      
      if (careIndex !== -1) {
        updated[sizeIndex].seasonalCare[careIndex] = {
          ...updated[sizeIndex].seasonalCare[careIndex],
          [field]: value
        };
      } else {
        updated[sizeIndex].seasonalCare.push({
          season: activeSeasonTab,
          wateringFrequency: '',
          amount_ml: 0,
          sunlightTypeId: '',
          humidity: '',
          fertilizerSchedule: [],
          [field]: value
        });
      }
      
      setSizeProfiles(updated);
    }
  };

  const addFertilizer = () => {
    const currentCare = getCurrentSeasonalCare();
    updateSeasonalCare('fertilizerSchedule', [
      ...currentCare.fertilizerSchedule,
      { fertilizerId: '', applicationFrequency: '', amount: '', notes: '' }
    ]);
  };

  const updateFertilizer = (fertIndex: number, field: keyof FertilizerSchedule, value: any) => {
    const currentCare = getCurrentSeasonalCare();
    const updatedFertilizers = [...currentCare.fertilizerSchedule];
    updatedFertilizers[fertIndex] = { ...updatedFertilizers[fertIndex], [field]: value };
    updateSeasonalCare('fertilizerSchedule', updatedFertilizers);
  };

  const removeFertilizer = (fertIndex: number) => {
    const currentCare = getCurrentSeasonalCare();
    const updatedFertilizers = currentCare.fertilizerSchedule.filter((_, index) => index !== fertIndex);
    updateSeasonalCare('fertilizerSchedule', updatedFertilizers);
  };

  const addColorVariant = () => {
    const updated = [...sizeProfiles];
    const sizeIndex = updated.findIndex(profile => profile.size === selectedSize);
    
    if (sizeIndex !== -1) {
      const variantCount = updated[sizeIndex].variants.length;
      updated[sizeIndex].variants.push({
        colorId: `color-${Date.now()}`,
        sku: `${plant?.name?.substring(0, 4).toUpperCase() || 'PLANT'}-${selectedSize.charAt(0)}-${variantCount + 1}`,
        name: '',
        hexCode: '#4CAF50',
        description: ''
      });
      setSizeProfiles(updated);
    }
  };

  const updateColorVariant = (variantIndex: number, field: keyof ColorVariant, value: any) => {
    const updated = [...sizeProfiles];
    const sizeIndex = updated.findIndex(profile => profile.size === selectedSize);
    
    if (sizeIndex !== -1) {
      updated[sizeIndex].variants[variantIndex] = {
        ...updated[sizeIndex].variants[variantIndex],
        [field]: value
      };
      setSizeProfiles(updated);
    }
  };

  const removeColorVariant = (variantIndex: number) => {
    const updated = [...sizeProfiles];
    const sizeIndex = updated.findIndex(profile => profile.size === selectedSize);
    
    if (sizeIndex !== -1) {
      updated[sizeIndex].variants.splice(variantIndex, 1);
      setSizeProfiles(updated);
    }
  };

  const saveSeasonalCareMutation = useMutation({
    mutationFn: async (seasonData: SeasonalCare) => {
      const response = await axios.post('/api/seasonal-care', {
        plantId,
        size: selectedSize,
        ...seasonData
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      showSuccessToast(`${variables.season} care saved successfully! 🌱`);
    },
    onError: () => {
      showErrorToast('Failed to save seasonal care');
    }
  });

  const saveColorVariantsMutation = useMutation({
    mutationFn: async (variants: ColorVariant[]) => {
      const promises = variants.map(variant => 
        axios.post('/api/color-variants', {
          plantId,
          size: selectedSize,
          ...variant
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      showSuccessToast(`Color variants for ${selectedSize} saved successfully! 🎨`);
    },
    onError: () => {
      showErrorToast('Failed to save color variants');
    }
  });

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
        humidity: '',
        fertilizerSchedule: []
      }],
      variants: []
    }]);
    setSelectedSize(newSize);
  };

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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Plant Variants</h1>
                  <p className="text-gray-600">
                    Manage size profiles and seasonal care for {plant?.name || 'Plant'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Size Profile Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Size Profiles</h2>
            <Button
              onClick={addSizeProfile}
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Size Profile
            </Button>
          </div>
          
          <div className="flex space-x-2">
            {sizeProfiles.map((profile) => (
              <Button
                key={profile.size}
                onClick={() => setSelectedSize(profile.size)}
                variant={selectedSize === profile.size ? "default" : "outline"}
                className={selectedSize === profile.size ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {profile.size}
              </Button>
            ))}
          </div>
        </div>

        {/* Seasonal Care Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Seasonal Care Instructions for {selectedSize}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSeasonTab} onValueChange={setActiveSeasonTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="Summer" className="text-base">Summer</TabsTrigger>
                <TabsTrigger value="Winter" className="text-base">Winter</TabsTrigger>
                <TabsTrigger value="Rainy" className="text-base">Rainy</TabsTrigger>
              </TabsList>

              {['Summer', 'Winter', 'Rainy'].map((season) => (
                <TabsContent key={season} value={season} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Watering Frequency (e.g., Every 3 days)
                      </Label>
                      <Input
                        placeholder="Every 3 days"
                        value={season === activeSeasonTab ? getCurrentSeasonalCare().wateringFrequency : ''}
                        onChange={(e) => {
                          if (season === activeSeasonTab) {
                            updateSeasonalCare('wateringFrequency', e.target.value);
                          }
                        }}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Water Amount (ml)</Label>
                      <Input
                        type="number"
                        placeholder="120"
                        value={season === activeSeasonTab ? getCurrentSeasonalCare().amount_ml || '' : ''}
                        onChange={(e) => {
                          if (season === activeSeasonTab) {
                            updateSeasonalCare('amount_ml', Number(e.target.value));
                          }
                        }}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">-- Select Sunlight --</Label>
                      <Select
                        value={season === activeSeasonTab ? getCurrentSeasonalCare().sunlightTypeId : ''}
                        onValueChange={(value) => {
                          if (season === activeSeasonTab) {
                            updateSeasonalCare('sunlightTypeId', value);
                          }
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="-- Select Sunlight --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunlight-direct-001">Direct Sunlight</SelectItem>
                          <SelectItem value="sunlight-indirect-001">Indirect Sunlight</SelectItem>
                          <SelectItem value="sunlight-partial-001">Partial Shade</SelectItem>
                          <SelectItem value="sunlight-shade-001">Full Shade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">-- Select Humidity --</Label>
                      <Select
                        value={season === activeSeasonTab ? getCurrentSeasonalCare().humidity : ''}
                        onValueChange={(value) => {
                          if (season === activeSeasonTab) {
                            updateSeasonalCare('humidity', value);
                          }
                        }}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="-- Select Humidity --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High (60-80%)</SelectItem>
                          <SelectItem value="Medium">Medium (40-60%)</SelectItem>
                          <SelectItem value="Low">Low (20-40%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Fertilizer Schedule */}
                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-800">Fertilizer Schedule for {season}</h4>
                      <Button
                        onClick={addFertilizer}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        + Add Fertilizer
                      </Button>
                    </div>

                    {season === activeSeasonTab && getCurrentSeasonalCare().fertilizerSchedule.map((fert, fertIndex) => (
                      <div key={fertIndex} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg items-end">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Fertilizer</Label>
                          <Select
                            value={fert.fertilizerId}
                            onValueChange={(value) => updateFertilizer(fertIndex, 'fertilizerId', value)}
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
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Frequency</Label>
                          <Input
                            className="h-9"
                            placeholder="Monthly"
                            value={fert.applicationFrequency}
                            onChange={(e) => updateFertilizer(fertIndex, 'applicationFrequency', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Amount</Label>
                          <Input
                            className="h-9"
                            placeholder="5ml"
                            value={fert.amount}
                            onChange={(e) => updateFertilizer(fertIndex, 'amount', e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={() => removeFertilizer(fertIndex)}
                          variant="outline"
                          size="sm"
                          className="h-9 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Save Button for Seasonal Care */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => {
                        if (season === activeSeasonTab) {
                          saveSeasonalCareMutation.mutate(getCurrentSeasonalCare());
                        }
                      }}
                      disabled={saveSeasonalCareMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    >
                      {saveSeasonalCareMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        `Save ${season} Care`
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Color Variants */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Color Variants for "{selectedSize}" Size</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={addColorVariant}
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                + Add Color Variant for {selectedSize}
              </Button>
            </div>

            {getCurrentSizeProfile()?.variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg items-end">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color Name</Label>
                  <Input
                    placeholder="e.g., Variegated Green"
                    value={variant.name}
                    onChange={(e) => updateColorVariant(variantIndex, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={variant.hexCode}
                      onChange={(e) => updateColorVariant(variantIndex, 'hexCode', e.target.value)}
                      className="w-10 h-9 border rounded cursor-pointer"
                    />
                    <Input
                      value={variant.hexCode}
                      onChange={(e) => updateColorVariant(variantIndex, 'hexCode', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">SKU</Label>
                  <Input
                    placeholder="AUTO-GENERATED"
                    value={variant.sku}
                    onChange={(e) => updateColorVariant(variantIndex, 'sku', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <Input
                    placeholder="Brief description"
                    value={variant.description}
                    onChange={(e) => updateColorVariant(variantIndex, 'description', e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => removeColorVariant(variantIndex)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {/* Save Button for Color Variants */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={() => saveColorVariantsMutation.mutate(getCurrentSizeProfile()?.variants || [])}
                disabled={saveColorVariantsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {saveColorVariantsMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  `Save Variants for ${selectedSize}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}