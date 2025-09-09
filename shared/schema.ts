import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  boolean, 
  integer, 
  decimal, 
  uuid, 
  timestamp,
  jsonb
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Colors table
export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  hexCode: text("hex_code").notNull(),
  isActive: boolean("is_active").default(true),
});

// Tag Groups table
export const tagGroups = pgTable("tag_groups", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

// Tags table
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tagGroupId: uuid("tag_group_id").references(() => tagGroups.id),
  isActive: boolean("is_active").default(true),
});

// Fertilizers table
export const fertilizers = pgTable("fertilizers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // NPK, Organic, Liquid, etc.
  npkRatio: text("npk_ratio"), // e.g., "10-10-10"
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

// Plants table
export const plants = pgTable("plants", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  plantClass: text("plant_class"),
  series: text("series"),
  placeOfOrigin: text("place_of_origin"),
  auraType: text("aura_type"),
  biodiversityBooster: boolean("biodiversity_booster").default(false),
  carbonAbsorber: boolean("carbon_absorber").default(false),
  temperatureMin: integer("temperature_min"),
  temperatureMax: integer("temperature_max"),
  categoryId: uuid("category_id").references(() => categories.id),
  soil: text("soil").array(),
  repotting: text("repotting").array(),
  maintenance: text("maintenance").array(),
  insideBox: text("inside_box").array(),
  benefits: text("benefits").array(),
  spiritualUseCase: text("spiritual_use_case").array(),
  bestForEmotion: text("best_for_emotion").array(),
  bestGiftFor: text("best_gift_for").array(),
  funFacts: text("fun_facts").array(),
  associatedDeity: text("associated_deity"),
  godAligned: text("god_aligned"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Plant Care Guidelines table
export const plantCareGuidelines = pgTable("plant_care_guidelines", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  plantId: uuid("plant_id").references(() => plants.id),
  season: text("season").notNull(), // Summer, Winter, Monsoon
  wateringFrequency: text("watering_frequency"),
  waterAmount: integer("water_amount"), // in ml
  sunlightType: text("sunlight_type"),
  humidityLevel: text("humidity_level"),
  careNotes: text("care_notes"),
});

// Plant Fertilizer Schedules table
export const plantFertilizerSchedules = pgTable("plant_fertilizer_schedules", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  plantId: uuid("plant_id").references(() => plants.id),
  fertilizerId: uuid("fertilizer_id").references(() => fertilizers.id),
  applicationFrequency: text("application_frequency"),
  applicationMethod: text("application_method"),
  season: text("season"),
  applicationTime: text("application_time"),
  dosage: text("dosage"),
  safetyNotes: text("safety_notes"),
});

// Plant Size Profiles table
export const plantSizeProfiles = pgTable("plant_size_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  plantId: uuid("plant_id").references(() => plants.id),
  size: text("size").notNull(), // Small, Medium, Large
  height: integer("height"), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
});

// Plant Variants table
export const plantVariants = pgTable("plant_variants", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  plantId: uuid("plant_id").references(() => plants.id),
  colorId: uuid("color_id").references(() => colors.id),
  sizeId: uuid("size_id").references(() => plantSizeProfiles.id),
  sku: text("sku").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  primaryImage: text("primary_image"),
  additionalImages: text("additional_images").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Plant Variant Tags (many-to-many)
export const plantVariantTags = pgTable("plant_variant_tags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  variantId: uuid("variant_id").references(() => plantVariants.id),
  tagId: uuid("tag_id").references(() => tags.id),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertColorSchema = createInsertSchema(colors).omit({
  id: true,
});

export const insertTagGroupSchema = createInsertSchema(tagGroups).omit({
  id: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
});

export const insertFertilizerSchema = createInsertSchema(fertilizers).omit({
  id: true,
});

export const insertPlantSchema = createInsertSchema(plants).omit({
  id: true,
  createdAt: true,
});

export const insertPlantCareGuidelineSchema = createInsertSchema(plantCareGuidelines).omit({
  id: true,
});

export const insertPlantFertilizerScheduleSchema = createInsertSchema(plantFertilizerSchedules).omit({
  id: true,
});

export const insertPlantSizeProfileSchema = createInsertSchema(plantSizeProfiles).omit({
  id: true,
});

export const insertPlantVariantSchema = createInsertSchema(plantVariants).omit({
  id: true,
  createdAt: true,
});

export const insertPlantVariantTagSchema = createInsertSchema(plantVariantTags).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Color = typeof colors.$inferSelect;
export type InsertColor = z.infer<typeof insertColorSchema>;

export type TagGroup = typeof tagGroups.$inferSelect;
export type InsertTagGroup = z.infer<typeof insertTagGroupSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type Fertilizer = typeof fertilizers.$inferSelect;
export type InsertFertilizer = z.infer<typeof insertFertilizerSchema>;

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;

export type PlantCareGuideline = typeof plantCareGuidelines.$inferSelect;
export type InsertPlantCareGuideline = z.infer<typeof insertPlantCareGuidelineSchema>;

export type PlantFertilizerSchedule = typeof plantFertilizerSchedules.$inferSelect;
export type InsertPlantFertilizerSchedule = z.infer<typeof insertPlantFertilizerScheduleSchema>;

export type PlantSizeProfile = typeof plantSizeProfiles.$inferSelect;
export type InsertPlantSizeProfile = z.infer<typeof insertPlantSizeProfileSchema>;

export type PlantVariant = typeof plantVariants.$inferSelect;
export type InsertPlantVariant = z.infer<typeof insertPlantVariantSchema>;

export type PlantVariantTag = typeof plantVariantTags.$inferSelect;
export type InsertPlantVariantTag = z.infer<typeof insertPlantVariantTagSchema>;
