export interface PlantWithCategory {
  id: string;
  name: string;
  scientificName: string | null;
  categoryName: string | null;
  price: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date | null;
}

export interface DashboardStats {
  totalPlants: number;
  activeVariants: number;
  categories: number;
  featuredPlants: number;
}

export interface SeasonalCare {
  season: 'summer' | 'winter' | 'monsoon';
  wateringFrequency: string;
  waterAmount: number;
  sunlightType: string;
  humidityLevel: string;
  careNotes: string;
}

export interface FertilizerSchedule {
  fertilizerId: string;
  applicationFrequency: string;
  applicationMethod: string;
  season: string;
  applicationTime: string;
  dosage: string;
  safetyNotes: string;
}

export interface SizeProfile {
  size: 'Small' | 'Medium' | 'Large';
  height: number;
  weight: number;
}

export interface ColorVariant {
  colorId: string;
  sku: string;
  price: number;
  isActive: boolean;
  notes: string;
  tags: string[];
  tagGroupId: string;
  primaryImage?: string;
  additionalImages: string[];
}

export interface ApiError {
  message: string;
  details?: any;
}

export interface FormErrors {
  [key: string]: string;
}
