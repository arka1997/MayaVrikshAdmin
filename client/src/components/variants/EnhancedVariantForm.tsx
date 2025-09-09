import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  Chip,
} from '@/components/ui/mui-components';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import { sizeProfileSchema, type SizeProfileData } from '@/validation/plantSchemas';
import axios from 'axios';

interface EnhancedVariantFormProps {
  plantId: string;
}

interface SizeProfile {
  size: string;
  height: number;
  weight: number;
}

interface SeasonalCare {
  season: string;
  wateringFrequency: string;
  waterAmount: string;
  sunlight: string;
  humidity: string;
}

interface FertilizerSchedule {
  fertilizer: string;
  frequency: string;
  amount: string;
}

interface ColorVariant {
  name: string;
  hexCode: string;
  description: string;
}

export function EnhancedVariantForm({ plantId }: EnhancedVariantFormProps) {
  const queryClient = useQueryClient();
  const [selectedSeason, setSelectedSeason] = useState('Summer');
  const [sizeProfile, setSizeProfile] = useState<SizeProfile>({
    size: 'Small',
    height: 0,
    weight: 0
  });
  
  const [seasonalCare, setSeasonalCare] = useState<SeasonalCare>({
    season: 'Summer',
    wateringFrequency: '',
    waterAmount: '',
    sunlight: '',
    humidity: ''
  });

  const [fertilizers, setFertilizers] = useState<FertilizerSchedule[]>([]);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);

  // Size Profile Mutation
  const saveSizeProfileMutation = useMutation({
    mutationFn: async (data: SizeProfile) => {
      const response = await axios.post('/api/size-profiles', {
        plantId,
        size: data.size,
        height: data.height,
        weight: data.weight
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast('Plant size saved successfully');
    },
    onError: () => {
      showErrorToast('Failed to save plant size');
    }
  });

  // Seasonal Care Mutation
  const saveSeasonalCareMutation = useMutation({
    mutationFn: async (data: SeasonalCare) => {
      const response = await axios.post('/api/care-guidelines', {
        plantId,
        season: data.season,
        wateringFrequency: data.wateringFrequency,
        waterAmount: data.waterAmount,
        sunlight: data.sunlight,
        humidity: data.humidity
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccessToast(`${selectedSeason} care saved successfully`);
    },
    onError: () => {
      showErrorToast(`Failed to save ${selectedSeason} care`);
    }
  });

  // Color Variants Mutation
  const saveColorVariantsMutation = useMutation({
    mutationFn: async (variants: ColorVariant[]) => {
      const promises = variants.map(variant => 
        axios.post('/api/plant-variants', {
          plantId,
          name: variant.name,
          colorId: variant.hexCode, // Using hex code as color identifier
          description: variant.description
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      showSuccessToast(`Variants for ${sizeProfile.size} saved successfully`);
    },
    onError: () => {
      showErrorToast(`Failed to save variants for ${sizeProfile.size}`);
    }
  });

  const handleSavePlantSize = () => {
    saveSizeProfileMutation.mutate(sizeProfile);
  };

  const handleSaveSeasonalCare = () => {
    saveSeasonalCareMutation.mutate(seasonalCare);
  };

  const handleSaveColorVariants = () => {
    saveColorVariantsMutation.mutate(colorVariants);
  };

  const addFertilizer = () => {
    setFertilizers([...fertilizers, { fertilizer: '', frequency: '', amount: '' }]);
  };

  const addColorVariant = () => {
    setColorVariants([...colorVariants, { name: '', hexCode: '#4CAF50', description: '' }]);
  };

  const removeFertilizer = (index: number) => {
    setFertilizers(fertilizers.filter((_, i) => i !== index));
  };

  const removeColorVariant = (index: number) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index));
  };

  return (
    <Box className="space-y-6">
      <Typography variant="h5" className="text-gray-800 font-semibold mb-4">
        2. Size Profiles, Care & Variants
      </Typography>

      {/* Size Profile Section */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <Box className="flex items-center gap-4 mb-4">
            <Typography variant="h6" color="primary" className="font-medium">
              Size Profile
            </Typography>
            <FormControl size="small" className="min-w-32">
              <Select
                value={sizeProfile.size}
                onChange={(e) => setSizeProfile({ ...sizeProfile, size: e.target.value })}
                className="text-sm"
              >
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Height (cm)"
              type="number"
              value={sizeProfile.height}
              onChange={(e) => setSizeProfile({ ...sizeProfile, height: Number(e.target.value) })}
              className="w-32"
            />
            <TextField
              size="small"
              placeholder="Weight (kg)"
              type="number"
              step="0.1"
              value={sizeProfile.weight}
              onChange={(e) => setSizeProfile({ ...sizeProfile, weight: Number(e.target.value) })}
              className="w-32"
            />
            <Button
              variant="contained"
              size="small"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm"
              onClick={handleSavePlantSize}
              disabled={saveSizeProfileMutation.isPending}
            >
              {saveSizeProfileMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="text"
              size="small"
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove Size
            </Button>
          </Box>

          <Divider className="my-4" />

          {/* Seasonal Care Section */}
          <Typography variant="h6" className="text-gray-800 mb-4">
            Seasonal Care Instructions for {sizeProfile.size}
          </Typography>

          <Box className="mb-4">
            <Tabs 
              value={selectedSeason} 
              onChange={(_, newValue) => {
                setSelectedSeason(newValue);
                setSeasonalCare({ ...seasonalCare, season: newValue });
              }}
              className="border-b"
            >
              <Tab label="Summer" value="Summer" />
              <Tab label="Winter" value="Winter" />
              <Tab label="Monsoon" value="Monsoon" />
            </Tabs>
          </Box>

          <Box className="grid grid-cols-2 gap-4 mb-4">
            <TextField
              size="small"
              placeholder="Watering Frequency (e.g., Every 3 days)"
              value={seasonalCare.wateringFrequency}
              onChange={(e) => setSeasonalCare({ ...seasonalCare, wateringFrequency: e.target.value })}
            />
            <TextField
              size="small"
              placeholder="Water Amount (ml)"
              value={seasonalCare.waterAmount}
              onChange={(e) => setSeasonalCare({ ...seasonalCare, waterAmount: e.target.value })}
            />
          </Box>

          <Box className="grid grid-cols-2 gap-4 mb-4">
            <FormControl size="small">
              <InputLabel>Sunlight</InputLabel>
              <Select
                value={seasonalCare.sunlight}
                onChange={(e) => setSeasonalCare({ ...seasonalCare, sunlight: e.target.value })}
                label="Sunlight"
              >
                <MenuItem value="">-- Select Sunlight --</MenuItem>
                <MenuItem value="Direct">Direct Sunlight</MenuItem>
                <MenuItem value="Indirect">Indirect Sunlight</MenuItem>
                <MenuItem value="Shade">Shade</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Humidity</InputLabel>
              <Select
                value={seasonalCare.humidity}
                onChange={(e) => setSeasonalCare({ ...seasonalCare, humidity: e.target.value })}
                label="Humidity"
              >
                <MenuItem value="">-- Select Humidity --</MenuItem>
                <MenuItem value="High">High (60-80%)</MenuItem>
                <MenuItem value="Medium">Medium (40-60%)</MenuItem>
                <MenuItem value="Low">Low (20-40%)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Fertilizer Schedule */}
          <Typography variant="h6" className="text-gray-800 mb-4">
            Fertilizer Schedule for {selectedSeason}
          </Typography>

          {fertilizers.map((fertilizer, index) => (
            <Box key={index} className="flex items-center gap-2 mb-2">
              <TextField
                size="small"
                placeholder="Fertilizer name"
                value={fertilizer.fertilizer}
                onChange={(e) => {
                  const updated = [...fertilizers];
                  updated[index].fertilizer = e.target.value;
                  setFertilizers(updated);
                }}
                className="flex-1"
              />
              <TextField
                size="small"
                placeholder="Frequency"
                value={fertilizer.frequency}
                onChange={(e) => {
                  const updated = [...fertilizers];
                  updated[index].frequency = e.target.value;
                  setFertilizers(updated);
                }}
                className="w-32"
              />
              <TextField
                size="small"
                placeholder="Amount"
                value={fertilizer.amount}
                onChange={(e) => {
                  const updated = [...fertilizers];
                  updated[index].amount = e.target.value;
                  setFertilizers(updated);
                }}
                className="w-32"
              />
              <Button
                variant="text"
                size="small"
                onClick={() => removeFertilizer(index)}
                className="text-red-500 min-w-0 px-2"
              >
                ×
              </Button>
            </Box>
          ))}

          <Button
            variant="text"
            size="small"
            onClick={addFertilizer}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            + Add Fertilizer
          </Button>

          <Box className="flex justify-end">
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={handleSaveSeasonalCare}
              disabled={saveSeasonalCareMutation.isPending}
            >
              {saveSeasonalCareMutation.isPending ? 'Saving...' : `Save ${selectedSeason} Care`}
            </Button>
          </Box>

          <Divider className="my-6" />

          {/* Color Variants Section */}
          <Typography variant="h6" className="text-gray-800 mb-4">
            Color Variants for "{sizeProfile.size}" Size
          </Typography>

          {colorVariants.map((variant, index) => (
            <Box key={index} className="flex items-center gap-2 mb-2">
              <TextField
                size="small"
                placeholder="Variant name"
                value={variant.name}
                onChange={(e) => {
                  const updated = [...colorVariants];
                  updated[index].name = e.target.value;
                  setColorVariants(updated);
                }}
                className="flex-1"
              />
              <input
                type="color"
                value={variant.hexCode}
                onChange={(e) => {
                  const updated = [...colorVariants];
                  updated[index].hexCode = e.target.value;
                  setColorVariants(updated);
                }}
                className="w-12 h-8 border rounded"
              />
              <TextField
                size="small"
                placeholder="Description"
                value={variant.description}
                onChange={(e) => {
                  const updated = [...colorVariants];
                  updated[index].description = e.target.value;
                  setColorVariants(updated);
                }}
                className="flex-1"
              />
              <Button
                variant="text"
                size="small"
                onClick={() => removeColorVariant(index)}
                className="text-red-500 min-w-0 px-2"
              >
                ×
              </Button>
            </Box>
          ))}

          <Button
            variant="text"
            size="small"
            onClick={addColorVariant}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            + Add Color Variant for {sizeProfile.size}
          </Button>

          <Box className="flex justify-end">
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              onClick={handleSaveColorVariants}
              disabled={saveColorVariantsMutation.isPending}
            >
              {saveColorVariantsMutation.isPending ? 'Saving...' : `Save Variants for ${sizeProfile.size}`}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}