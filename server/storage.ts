import { 
  type User, 
  type InsertUser,
  type Plant,
  type InsertPlant,
  type Category,
  type InsertCategory,
  type Color,
  type InsertColor,
  type Tag,
  type InsertTag,
  type TagGroup,
  type InsertTagGroup,
  type Fertilizer,
  type InsertFertilizer,
  type PlantVariant,
  type InsertPlantVariant,
  type PlantCareGuideline,
  type InsertPlantCareGuideline,
  type PlantFertilizerSchedule,
  type InsertPlantFertilizerSchedule,
  type PlantSizeProfile,
  type InsertPlantSizeProfile,
  type PlantVariantTag,
  type InsertPlantVariantTag
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Plants
  getPlants(): Promise<Plant[]>;
  getPlant(id: string): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  updatePlant(id: string, plant: Partial<InsertPlant>): Promise<Plant | undefined>;
  deletePlant(id: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Colors
  getColors(): Promise<Color[]>;
  getColor(id: string): Promise<Color | undefined>;
  createColor(color: InsertColor): Promise<Color>;
  updateColor(id: string, color: Partial<InsertColor>): Promise<Color | undefined>;
  deleteColor(id: string): Promise<boolean>;

  // Tags
  getTags(): Promise<Tag[]>;
  getTag(id: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: string, tag: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: string): Promise<boolean>;

  // Tag Groups
  getTagGroups(): Promise<TagGroup[]>;
  getTagGroup(id: string): Promise<TagGroup | undefined>;
  createTagGroup(tagGroup: InsertTagGroup): Promise<TagGroup>;
  updateTagGroup(id: string, tagGroup: Partial<InsertTagGroup>): Promise<TagGroup | undefined>;
  deleteTagGroup(id: string): Promise<boolean>;

  // Fertilizers
  getFertilizers(): Promise<Fertilizer[]>;
  getFertilizer(id: string): Promise<Fertilizer | undefined>;
  createFertilizer(fertilizer: InsertFertilizer): Promise<Fertilizer>;
  updateFertilizer(id: string, fertilizer: Partial<InsertFertilizer>): Promise<Fertilizer | undefined>;
  deleteFertilizer(id: string): Promise<boolean>;

  // Plant Variants
  getPlantVariants(plantId?: string): Promise<PlantVariant[]>;
  getPlantVariant(id: string): Promise<PlantVariant | undefined>;
  createPlantVariant(variant: InsertPlantVariant): Promise<PlantVariant>;
  updatePlantVariant(id: string, variant: Partial<InsertPlantVariant>): Promise<PlantVariant | undefined>;
  deletePlantVariant(id: string): Promise<boolean>;

  // Plant Care Guidelines
  getPlantCareGuidelines(plantId?: string): Promise<PlantCareGuideline[]>;
  createPlantCareGuideline(guideline: InsertPlantCareGuideline): Promise<PlantCareGuideline>;
  updatePlantCareGuideline(id: string, guideline: Partial<InsertPlantCareGuideline>): Promise<PlantCareGuideline | undefined>;
  deletePlantCareGuideline(id: string): Promise<boolean>;

  // Plant Fertilizer Schedules
  getPlantFertilizerSchedules(plantId?: string): Promise<PlantFertilizerSchedule[]>;
  createPlantFertilizerSchedule(schedule: InsertPlantFertilizerSchedule): Promise<PlantFertilizerSchedule>;
  updatePlantFertilizerSchedule(id: string, schedule: Partial<InsertPlantFertilizerSchedule>): Promise<PlantFertilizerSchedule | undefined>;
  deletePlantFertilizerSchedule(id: string): Promise<boolean>;

  // Plant Size Profiles
  getPlantSizeProfiles(plantId?: string): Promise<PlantSizeProfile[]>;
  createPlantSizeProfile(profile: InsertPlantSizeProfile): Promise<PlantSizeProfile>;
  updatePlantSizeProfile(id: string, profile: Partial<InsertPlantSizeProfile>): Promise<PlantSizeProfile | undefined>;
  deletePlantSizeProfile(id: string): Promise<boolean>;

  // Plant Variant Tags
  getPlantVariantTags(variantId?: string): Promise<PlantVariantTag[]>;
  createPlantVariantTag(variantTag: InsertPlantVariantTag): Promise<PlantVariantTag>;
  deletePlantVariantTag(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private plants: Map<string, Plant>;
  private categories: Map<string, Category>;
  private colors: Map<string, Color>;
  private tags: Map<string, Tag>;
  private tagGroups: Map<string, TagGroup>;
  private fertilizers: Map<string, Fertilizer>;
  private plantVariants: Map<string, PlantVariant>;
  private plantCareGuidelines: Map<string, PlantCareGuideline>;
  private plantFertilizerSchedules: Map<string, PlantFertilizerSchedule>;
  private plantSizeProfiles: Map<string, PlantSizeProfile>;
  private plantVariantTags: Map<string, PlantVariantTag>;

  constructor() {
    this.users = new Map();
    this.plants = new Map();
    this.categories = new Map();
    this.colors = new Map();
    this.tags = new Map();
    this.tagGroups = new Map();
    this.fertilizers = new Map();
    this.plantVariants = new Map();
    this.plantCareGuidelines = new Map();
    this.plantFertilizerSchedules = new Map();
    this.plantSizeProfiles = new Map();
    this.plantVariantTags = new Map();

    // Initialize with some seed data
    this.initializeSeedData();
  }

  private initializeSeedData() {
    // Categories
    const indoorCategory: Category = {
      id: randomUUID(),
      name: "Indoor Plants",
      description: "Plants suitable for indoor environments",
      isActive: true,
      createdAt: new Date(),
    };
    
    const outdoorCategory: Category = {
      id: randomUUID(),
      name: "Outdoor Plants",
      description: "Plants suitable for outdoor environments",
      isActive: true,
      createdAt: new Date(),
    };

    this.categories.set(indoorCategory.id, indoorCategory);
    this.categories.set(outdoorCategory.id, outdoorCategory);

    // Colors
    const colors = [
      { name: "Classic Green", hexCode: "#4CAF50" },
      { name: "Variegated", hexCode: "#81C784" },
      { name: "Dark Green", hexCode: "#2E7D32" },
      { name: "Light Green", hexCode: "#C8E6C9" },
    ];

    colors.forEach(color => {
      const colorEntity: Color = {
        id: randomUUID(),
        ...color,
        isActive: true,
      };
      this.colors.set(colorEntity.id, colorEntity);
    });

    // Fertilizers
    const fertilizers = [
      { name: "NPK 10-10-10", type: "NPK", npkRatio: "10-10-10", description: "Balanced fertilizer for general use" },
      { name: "Organic Compost", type: "Organic", npkRatio: null, description: "Natural organic fertilizer" },
      { name: "Liquid Fertilizer", type: "Liquid", npkRatio: "5-5-5", description: "Quick absorption liquid fertilizer" },
    ];

    fertilizers.forEach(fertilizer => {
      const fertilizerEntity: Fertilizer = {
        id: randomUUID(),
        ...fertilizer,
        isActive: true,
      };
      this.fertilizers.set(fertilizerEntity.id, fertilizerEntity);
    });

    // Tag Groups
    const indoorTagGroup: TagGroup = {
      id: randomUUID(),
      name: "Indoor Collection",
      description: "Tags for indoor plants",
      isActive: true,
    };

    this.tagGroups.set(indoorTagGroup.id, indoorTagGroup);

    // Tags
    const tags = [
      { name: "Air Purifying", tagGroupId: indoorTagGroup.id },
      { name: "Low Maintenance", tagGroupId: indoorTagGroup.id },
      { name: "Pet Friendly", tagGroupId: indoorTagGroup.id },
      { name: "Beginner Friendly", tagGroupId: indoorTagGroup.id },
    ];

    tags.forEach(tag => {
      const tagEntity: Tag = {
        id: randomUUID(),
        ...tag,
        isActive: true,
      };
      this.tags.set(tagEntity.id, tagEntity);
    });

    // Sample Plants
    const samplePlants = [
      {
        name: "Monstera Deliciosa",
        scientificName: "Monstera deliciosa",
        description: "A popular indoor plant with distinctive split leaves",
        categoryId: indoorCategory.id,
        isActive: true,
        isFeatured: true,
        price: 1299,
        cost: 800,
      },
      {
        name: "Snake Plant",
        scientificName: "Sansevieria trifasciata",
        description: "Low-maintenance air purifying plant perfect for beginners",
        categoryId: indoorCategory.id,
        isActive: true,
        isFeatured: false,
        price: 899,
        cost: 500,
      }
    ];

    samplePlants.forEach(plant => {
      const plantEntity: Plant = {
        id: randomUUID(),
        ...plant,
        createdAt: new Date(),
      };
      this.plants.set(plantEntity.id, plantEntity);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Plants
  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: string): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const id = randomUUID();
    const plant: Plant = {
      ...insertPlant,
      id,
      createdAt: new Date(),
    };
    this.plants.set(id, plant);
    return plant;
  }

  async updatePlant(id: string, updateData: Partial<InsertPlant>): Promise<Plant | undefined> {
    const existing = this.plants.get(id);
    if (!existing) return undefined;
    
    const updated: Plant = { ...existing, ...updateData };
    this.plants.set(id, updated);
    return updated;
  }

  async deletePlant(id: string): Promise<boolean> {
    return this.plants.delete(id);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    
    const updated: Category = { ...existing, ...updateData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Colors
  async getColors(): Promise<Color[]> {
    return Array.from(this.colors.values());
  }

  async getColor(id: string): Promise<Color | undefined> {
    return this.colors.get(id);
  }

  async createColor(insertColor: InsertColor): Promise<Color> {
    const id = randomUUID();
    const color: Color = { ...insertColor, id };
    this.colors.set(id, color);
    return color;
  }

  async updateColor(id: string, updateData: Partial<InsertColor>): Promise<Color | undefined> {
    const existing = this.colors.get(id);
    if (!existing) return undefined;
    
    const updated: Color = { ...existing, ...updateData };
    this.colors.set(id, updated);
    return updated;
  }

  async deleteColor(id: string): Promise<boolean> {
    return this.colors.delete(id);
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async getTag(id: string): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = randomUUID();
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  async updateTag(id: string, updateData: Partial<InsertTag>): Promise<Tag | undefined> {
    const existing = this.tags.get(id);
    if (!existing) return undefined;
    
    const updated: Tag = { ...existing, ...updateData };
    this.tags.set(id, updated);
    return updated;
  }

  async deleteTag(id: string): Promise<boolean> {
    return this.tags.delete(id);
  }

  // Tag Groups
  async getTagGroups(): Promise<TagGroup[]> {
    return Array.from(this.tagGroups.values());
  }

  async getTagGroup(id: string): Promise<TagGroup | undefined> {
    return this.tagGroups.get(id);
  }

  async createTagGroup(insertTagGroup: InsertTagGroup): Promise<TagGroup> {
    const id = randomUUID();
    const tagGroup: TagGroup = { ...insertTagGroup, id };
    this.tagGroups.set(id, tagGroup);
    return tagGroup;
  }

  async updateTagGroup(id: string, updateData: Partial<InsertTagGroup>): Promise<TagGroup | undefined> {
    const existing = this.tagGroups.get(id);
    if (!existing) return undefined;
    
    const updated: TagGroup = { ...existing, ...updateData };
    this.tagGroups.set(id, updated);
    return updated;
  }

  async deleteTagGroup(id: string): Promise<boolean> {
    return this.tagGroups.delete(id);
  }

  // Fertilizers
  async getFertilizers(): Promise<Fertilizer[]> {
    return Array.from(this.fertilizers.values());
  }

  async getFertilizer(id: string): Promise<Fertilizer | undefined> {
    return this.fertilizers.get(id);
  }

  async createFertilizer(insertFertilizer: InsertFertilizer): Promise<Fertilizer> {
    const id = randomUUID();
    const fertilizer: Fertilizer = { ...insertFertilizer, id };
    this.fertilizers.set(id, fertilizer);
    return fertilizer;
  }

  async updateFertilizer(id: string, updateData: Partial<InsertFertilizer>): Promise<Fertilizer | undefined> {
    const existing = this.fertilizers.get(id);
    if (!existing) return undefined;
    
    const updated: Fertilizer = { ...existing, ...updateData };
    this.fertilizers.set(id, updated);
    return updated;
  }

  async deleteFertilizer(id: string): Promise<boolean> {
    return this.fertilizers.delete(id);
  }

  // Plant Variants
  async getPlantVariants(plantId?: string): Promise<PlantVariant[]> {
    const variants = Array.from(this.plantVariants.values());
    if (plantId) {
      return variants.filter(variant => variant.plantId === plantId);
    }
    return variants;
  }

  async getPlantVariant(id: string): Promise<PlantVariant | undefined> {
    return this.plantVariants.get(id);
  }

  async createPlantVariant(insertVariant: InsertPlantVariant): Promise<PlantVariant> {
    const id = randomUUID();
    const variant: PlantVariant = {
      ...insertVariant,
      id,
      createdAt: new Date(),
    };
    this.plantVariants.set(id, variant);
    return variant;
  }

  async updatePlantVariant(id: string, updateData: Partial<InsertPlantVariant>): Promise<PlantVariant | undefined> {
    const existing = this.plantVariants.get(id);
    if (!existing) return undefined;
    
    const updated: PlantVariant = { ...existing, ...updateData };
    this.plantVariants.set(id, updated);
    return updated;
  }

  async deletePlantVariant(id: string): Promise<boolean> {
    return this.plantVariants.delete(id);
  }

  // Plant Care Guidelines
  async getPlantCareGuidelines(plantId?: string): Promise<PlantCareGuideline[]> {
    const guidelines = Array.from(this.plantCareGuidelines.values());
    if (plantId) {
      return guidelines.filter(guideline => guideline.plantId === plantId);
    }
    return guidelines;
  }

  async createPlantCareGuideline(insertGuideline: InsertPlantCareGuideline): Promise<PlantCareGuideline> {
    const id = randomUUID();
    const guideline: PlantCareGuideline = { ...insertGuideline, id };
    this.plantCareGuidelines.set(id, guideline);
    return guideline;
  }

  async updatePlantCareGuideline(id: string, updateData: Partial<InsertPlantCareGuideline>): Promise<PlantCareGuideline | undefined> {
    const existing = this.plantCareGuidelines.get(id);
    if (!existing) return undefined;
    
    const updated: PlantCareGuideline = { ...existing, ...updateData };
    this.plantCareGuidelines.set(id, updated);
    return updated;
  }

  async deletePlantCareGuideline(id: string): Promise<boolean> {
    return this.plantCareGuidelines.delete(id);
  }

  // Plant Fertilizer Schedules
  async getPlantFertilizerSchedules(plantId?: string): Promise<PlantFertilizerSchedule[]> {
    const schedules = Array.from(this.plantFertilizerSchedules.values());
    if (plantId) {
      return schedules.filter(schedule => schedule.plantId === plantId);
    }
    return schedules;
  }

  async createPlantFertilizerSchedule(insertSchedule: InsertPlantFertilizerSchedule): Promise<PlantFertilizerSchedule> {
    const id = randomUUID();
    const schedule: PlantFertilizerSchedule = { ...insertSchedule, id };
    this.plantFertilizerSchedules.set(id, schedule);
    return schedule;
  }

  async updatePlantFertilizerSchedule(id: string, updateData: Partial<InsertPlantFertilizerSchedule>): Promise<PlantFertilizerSchedule | undefined> {
    const existing = this.plantFertilizerSchedules.get(id);
    if (!existing) return undefined;
    
    const updated: PlantFertilizerSchedule = { ...existing, ...updateData };
    this.plantFertilizerSchedules.set(id, updated);
    return updated;
  }

  async deletePlantFertilizerSchedule(id: string): Promise<boolean> {
    return this.plantFertilizerSchedules.delete(id);
  }

  // Plant Size Profiles
  async getPlantSizeProfiles(plantId?: string): Promise<PlantSizeProfile[]> {
    const profiles = Array.from(this.plantSizeProfiles.values());
    if (plantId) {
      return profiles.filter(profile => profile.plantId === plantId);
    }
    return profiles;
  }

  async createPlantSizeProfile(insertProfile: InsertPlantSizeProfile): Promise<PlantSizeProfile> {
    const id = randomUUID();
    const profile: PlantSizeProfile = { ...insertProfile, id };
    this.plantSizeProfiles.set(id, profile);
    return profile;
  }

  async updatePlantSizeProfile(id: string, updateData: Partial<InsertPlantSizeProfile>): Promise<PlantSizeProfile | undefined> {
    const existing = this.plantSizeProfiles.get(id);
    if (!existing) return undefined;
    
    const updated: PlantSizeProfile = { ...existing, ...updateData };
    this.plantSizeProfiles.set(id, updated);
    return updated;
  }

  async deletePlantSizeProfile(id: string): Promise<boolean> {
    return this.plantSizeProfiles.delete(id);
  }

  // Plant Variant Tags
  async getPlantVariantTags(variantId?: string): Promise<PlantVariantTag[]> {
    const variantTags = Array.from(this.plantVariantTags.values());
    if (variantId) {
      return variantTags.filter(vt => vt.variantId === variantId);
    }
    return variantTags;
  }

  async createPlantVariantTag(insertVariantTag: InsertPlantVariantTag): Promise<PlantVariantTag> {
    const id = randomUUID();
    const variantTag: PlantVariantTag = { ...insertVariantTag, id };
    this.plantVariantTags.set(id, variantTag);
    return variantTag;
  }

  async deletePlantVariantTag(id: string): Promise<boolean> {
    return this.plantVariantTags.delete(id);
  }
}

export const storage = new MemStorage();
