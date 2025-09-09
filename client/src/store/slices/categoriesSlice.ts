import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category, InsertCategory } from '@shared/schema';
import axios from 'axios';
import { logger } from '@/utils/logger';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      logger.info('Fetching categories');
      const response = await axios.get('/api/categories');
      return response.data;
    } catch (error: any) {
      logger.error('Failed to fetch categories', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: InsertCategory, { rejectWithValue }) => {
    try {
      logger.info('Creating category', categoryData);
      const response = await axios.post('/api/categories', categoryData);
      return response.data;
    } catch (error: any) {
      logger.error('Failed to create category', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
