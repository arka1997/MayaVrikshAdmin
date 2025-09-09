import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlantSchema, 
  insertCategorySchema,
  insertColorSchema,
  insertTagSchema,
  insertTagGroupSchema,
  insertFertilizerSchema,
  insertPlantVariantSchema,
  insertPlantCareGuidelineSchema,
  insertPlantFertilizerScheduleSchema,
  insertPlantSizeProfileSchema,
  insertPlantVariantTagSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Plants routes
  app.get("/api/plants", async (req, res) => {
    try {
      const plants = await storage.getPlants();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plants" });
    }
  });

  app.get("/api/plants/:id", async (req, res) => {
    try {
      const plant = await storage.getPlant(req.params.id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      res.json(plant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant" });
    }
  });

  app.post("/api/plants", async (req, res) => {
    try {
      const validatedData = insertPlantSchema.parse(req.body);
      const plant = await storage.createPlant(validatedData);
      res.status(201).json(plant);
    } catch (error) {
      res.status(400).json({ message: "Invalid plant data", error });
    }
  });

  app.put("/api/plants/:id", async (req, res) => {
    try {
      const validatedData = insertPlantSchema.partial().parse(req.body);
      const plant = await storage.updatePlant(req.params.id, validatedData);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      res.json(plant);
    } catch (error) {
      res.status(400).json({ message: "Invalid plant data", error });
    }
  });

  app.delete("/api/plants/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePlant(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Plant not found" });
      }
      res.json({ message: "Plant deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plant" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data", error });
    }
  });

  // Colors routes
  app.get("/api/colors", async (req, res) => {
    try {
      const colors = await storage.getColors();
      res.json(colors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch colors" });
    }
  });

  app.post("/api/colors", async (req, res) => {
    try {
      const validatedData = insertColorSchema.parse(req.body);
      const color = await storage.createColor(validatedData);
      res.status(201).json(color);
    } catch (error) {
      res.status(400).json({ message: "Invalid color data", error });
    }
  });

  // Tags routes
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ message: "Invalid tag data", error });
    }
  });

  // Tag Groups routes
  app.get("/api/tag-groups", async (req, res) => {
    try {
      const tagGroups = await storage.getTagGroups();
      res.json(tagGroups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tag groups" });
    }
  });

  app.post("/api/tag-groups", async (req, res) => {
    try {
      const validatedData = insertTagGroupSchema.parse(req.body);
      const tagGroup = await storage.createTagGroup(validatedData);
      res.status(201).json(tagGroup);
    } catch (error) {
      res.status(400).json({ message: "Invalid tag group data", error });
    }
  });

  // Fertilizers routes
  app.get("/api/fertilizers", async (req, res) => {
    try {
      const fertilizers = await storage.getFertilizers();
      res.json(fertilizers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fertilizers" });
    }
  });

  app.post("/api/fertilizers", async (req, res) => {
    try {
      const validatedData = insertFertilizerSchema.parse(req.body);
      const fertilizer = await storage.createFertilizer(validatedData);
      res.status(201).json(fertilizer);
    } catch (error) {
      res.status(400).json({ message: "Invalid fertilizer data", error });
    }
  });

  // Plant Variants routes
  app.get("/api/variants", async (req, res) => {
    try {
      const plantId = req.query.plantId as string;
      const variants = await storage.getPlantVariants(plantId);
      res.json(variants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch variants" });
    }
  });

  app.post("/api/variants", async (req, res) => {
    try {
      const validatedData = insertPlantVariantSchema.parse(req.body);
      const variant = await storage.createPlantVariant(validatedData);
      res.status(201).json(variant);
    } catch (error) {
      res.status(400).json({ message: "Invalid variant data", error });
    }
  });

  // Plant Care Guidelines routes
  app.get("/api/care-guidelines", async (req, res) => {
    try {
      const plantId = req.query.plantId as string;
      const guidelines = await storage.getPlantCareGuidelines(plantId);
      res.json(guidelines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch care guidelines" });
    }
  });

  app.post("/api/care-guidelines", async (req, res) => {
    try {
      const validatedData = insertPlantCareGuidelineSchema.parse(req.body);
      const guideline = await storage.createPlantCareGuideline(validatedData);
      res.status(201).json(guideline);
    } catch (error) {
      res.status(400).json({ message: "Invalid care guideline data", error });
    }
  });

  // Plant Fertilizer Schedules routes
  app.get("/api/fertilizer-schedules", async (req, res) => {
    try {
      const plantId = req.query.plantId as string;
      const schedules = await storage.getPlantFertilizerSchedules(plantId);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fertilizer schedules" });
    }
  });

  app.post("/api/fertilizer-schedules", async (req, res) => {
    try {
      const validatedData = insertPlantFertilizerScheduleSchema.parse(req.body);
      const schedule = await storage.createPlantFertilizerSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid fertilizer schedule data", error });
    }
  });

  // Plant Size Profiles routes
  app.get("/api/size-profiles", async (req, res) => {
    try {
      const plantId = req.query.plantId as string;
      const profiles = await storage.getPlantSizeProfiles(plantId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch size profiles" });
    }
  });

  app.post("/api/size-profiles", async (req, res) => {
    try {
      const validatedData = insertPlantSizeProfileSchema.parse(req.body);
      const profile = await storage.createPlantSizeProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid size profile data", error });
    }
  });

  // Plant Variant Tags routes
  app.get("/api/variant-tags", async (req, res) => {
    try {
      const variantId = req.query.variantId as string;
      const variantTags = await storage.getPlantVariantTags(variantId);
      res.json(variantTags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch variant tags" });
    }
  });

  app.post("/api/variant-tags", async (req, res) => {
    try {
      const validatedData = insertPlantVariantTagSchema.parse(req.body);
      const variantTag = await storage.createPlantVariantTag(validatedData);
      res.status(201).json(variantTag);
    } catch (error) {
      res.status(400).json({ message: "Invalid variant tag data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
