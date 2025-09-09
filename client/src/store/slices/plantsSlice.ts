import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Plant, InsertPlant } from '@shared/schema';
import axios from 'axios';
import { logger } from '@/utils/logger';

interface PlantsState {
  plants: Plant[];
  currentPlant: Plant | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlantsState = {
  plants: [],
  currentPlant: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async (_, { rejectWithValue }) => {
    try {
      logger.info('Fetching plants');
      const response = await axios.get('/api/plants');
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch plants', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plants');
    }
  }
);

export const createPlant = createAsyncThunk(
  'plants/createPlant',
  async (plantData: InsertPlant, { rejectWithValue }) => {
    try {
      logger.info('Creating plant', plantData);
      const response = await axios.post('/api/plants', plantData);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to create plant', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create plant');
    }
  }
);

export const updatePlant = createAsyncThunk(
  'plants/updatePlant',
  async ({ id, plantData }: { id: string; plantData: Partial<InsertPlant> }, { rejectWithValue }) => {
    try {
      logger.info('Updating plant', { id, plantData });
      const response = await axios.put(`/api/plants/${id}`, plantData);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to update plant', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update plant');
    }
  }
);

export const deletePlant = createAsyncThunk(
  'plants/deletePlant',
  async (id: string, { rejectWithValue }) => {
    try {
      logger.info('Deleting plant', { id });
      await axios.delete(`/api/plants/${id}`);
      return id;
    } catch (error: any) {
      logger.error('Failed to delete plant', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete plant');
    }
  }
);

const plantsSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    setCurrentPlant: (state, action: PayloadAction<Plant | null>) => {
      state.currentPlant = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plants
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = action.payload;
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create plant
      .addCase(createPlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlant.fulfilled, (state, action) => {
        state.loading = false;
        state.plants.push(action.payload);
      })
      .addCase(createPlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update plant
      .addCase(updatePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.plants.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plants[index] = action.payload;
        }
        if (state.currentPlant?.id === action.payload.id) {
          state.currentPlant = action.payload;
        }
      })
      .addCase(updatePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete plant
      .addCase(deletePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlant.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = state.plants.filter(p => p.id !== action.payload);
        if (state.currentPlant?.id === action.payload) {
          state.currentPlant = null;
        }
      })
      .addCase(deletePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPlant, clearError } = plantsSlice.actions;
export default plantsSlice.reducer;
