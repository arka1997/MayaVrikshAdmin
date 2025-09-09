import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { RootState } from '@/store';
import { fetchPlants, deletePlant } from '@/store/slices/plantsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@/components/ui/mui-components';
import { 
  Edit, 
  Delete, 
  Tune, 
  Star 
} from '@mui/icons-material';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandler';
import axios from 'axios';

interface PlantListProps {
  onManageVariants?: (plantId: string, plantName: string) => void;
}

export function PlantList({ onManageVariants }: PlantListProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<string | null>(null);

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const response = await axios.get('/api/plants');
      return response.data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/api/categories');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (plantId: string) => {
      await axios.delete(`/api/plants/${plantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] });
      showSuccessToast('Plant deleted successfully');
      setDeleteDialogOpen(false);
      setPlantToDelete(null);
    },
    onError: () => {
      showErrorToast('Failed to delete plant');
    },
  });

  const handleEdit = (plantId: string) => {
    navigate(`/plants/edit/${plantId}`);
  };

  const handleDelete = (plantId: string) => {
    setPlantToDelete(plantId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (plantToDelete) {
      deleteMutation.mutate(plantToDelete);
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <Box className="text-center py-8">
        <Typography>Loading plants...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper className="overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plant</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="textSecondary">
                      No plants found. Add your first plant to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                plants.map((plant: any) => (
                  <TableRow key={plant.id} hover>
                    <TableCell>
                      <Box className="flex items-center space-x-4">
                        <div className="w-16 h-16 gradient-green rounded-lg flex items-center justify-center">
                          <Typography className="text-white font-bold">
                            {plant.name.charAt(0)}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="body1" fontWeight="medium">
                            {plant.name}
                          </Typography>
                          {plant.scientificName && (
                            <Typography variant="body2" color="textSecondary" fontStyle="italic">
                              {plant.scientificName}
                            </Typography>
                          )}
                          {plant.isFeatured && (
                            <Chip
                              icon={<Star />}
                              label="Best Seller"
                              size="small"
                              color="warning"
                              className="mt-1"
                            />
                          )}
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getCategoryName(plant.categoryId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={plant.isActive ? 'Active' : 'Inactive'}
                        color={plant.isActive ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleEdit(plant.id)}
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          data-testid={`button-edit-${plant.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => onManageVariants?.(plant.id, plant.name)}
                          variant="contained"
                          size="small"
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`button-variants-${plant.id}`}
                        >
                          Manage Variants
                        </Button>
                        <IconButton
                          onClick={() => handleDelete(plant.id)}
                          color="error"
                          size="small"
                          data-testid={`button-delete-${plant.id}`}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this plant? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
