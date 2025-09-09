import { configureStore } from '@reduxjs/toolkit';
import plantsReducer from './slices/plantsSlice';
import categoriesReducer from './slices/categoriesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    plants: plantsReducer,
    categories: categoriesReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
