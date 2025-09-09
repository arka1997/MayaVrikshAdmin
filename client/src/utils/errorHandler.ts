import { logger } from './logger';
import { toast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const handleApiError = (error: any): ApiError => {
  logger.error('API Error:', error);

  let apiError: ApiError = {
    message: 'An unexpected error occurred',
  };

  if (error.response) {
    // Server responded with error status
    apiError = {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    apiError.message = 'Network error - please check your connection';
  } else if (error.message) {
    // Something else happened
    apiError.message = error.message;
  }

  return apiError;
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const apiError = handleApiError(error);
      
      toast({
        title: "Error",
        description: apiError.message,
        variant: "destructive",
      });
      
      throw apiError;
    }
  };
};

export const showErrorToast = (message: string) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

export const showSuccessToast = (message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};
