import { z } from 'zod';

export const plantFormSchema = z.object({
  name: z.string().min(1, 'Plant name is required').max(100, 'Name too long'),
  scientificName: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  plantClass: z.string().optional(),
  series: z.string().optional(),
  placeOfOrigin: z.string().optional(),
  auraType: z.string().optional(),
  biodiversityBooster: z.boolean().default(false),
  carbonAbsorber: z.boolean().default(false),
  temperatureMin: z.number().min(-50).max(60).optional(),
  temperatureMax: z.number().min(-50).max(60).optional(),
  categoryId: z.string().uuid('Invalid category').optional(),
  soil: z.array(z.string()).default([]),
  repotting: z.array(z.string()).default([]),
  maintenance: z.array(z.string()).default([]),
  insideBox: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  spiritualUseCase: z.array(z.string()).default([]),
  bestForEmotion: z.array(z.string()).default([]),
  bestGiftFor: z.array(z.string()).default([]),
  funFacts: z.array(z.string()).default([]),
  associatedDeity: z.string().optional(),
  godAligned: z.string().optional(),
}).refine((data) => {
  if (data.temperatureMin !== undefined && data.temperatureMax !== undefined) {
    return data.temperatureMin <= data.temperatureMax;
  }
  return true;
}, {
  message: "Minimum temperature must be less than or equal to maximum temperature",
  path: ["temperatureMax"],
});

export const careGuidelineSchema = z.object({
  plantId: z.string().uuid(),
  season: z.enum(['summer', 'winter', 'monsoon']),
  wateringFrequency: z.string().min(1, 'Watering frequency is required'),
  waterAmount: z.number().min(1, 'Water amount must be positive'),
  sunlightType: z.string().min(1, 'Sunlight type is required'),
  humidityLevel: z.string().min(1, 'Humidity level is required'),
  careNotes: z.string().optional(),
});

export const fertilizerScheduleSchema = z.object({
  plantId: z.string().uuid(),
  fertilizerId: z.string().uuid(),
  applicationFrequency: z.string().min(1, 'Application frequency is required'),
  applicationMethod: z.string().min(1, 'Application method is required'),
  season: z.string().min(1, 'Season is required'),
  applicationTime: z.string().min(1, 'Application time is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  safetyNotes: z.string().optional(),
});

export const sizeProfileSchema = z.object({
  plantId: z.string().uuid(),
  size: z.enum(['Small', 'Medium', 'Large']),
  height: z.number().min(1, 'Height must be positive'),
  weight: z.number().min(0.1, 'Weight must be positive'),
});

export const colorVariantSchema = z.object({
  plantId: z.string().uuid(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid().optional(),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0.01, 'Price must be positive'),
  costPrice: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
  primaryImage: z.string().optional(),
  additionalImages: z.array(z.string()).default([]),
});

export type PlantFormData = z.infer<typeof plantFormSchema>;
export type CareGuidelineData = z.infer<typeof careGuidelineSchema>;
export type FertilizerScheduleData = z.infer<typeof fertilizerScheduleSchema>;
export type SizeProfileData = z.infer<typeof sizeProfileSchema>;
export type ColorVariantData = z.infer<typeof colorVariantSchema>;
