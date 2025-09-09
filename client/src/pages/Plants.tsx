import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlantList } from '@/components/plants/PlantList';
import { PlantForm } from '@/components/plants/PlantForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Add } from '@mui/icons-material';

export default function Plants() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPlant = () => {
    setShowAddForm(true);
  };

  const handlePlantSaved = () => {
    setShowAddForm(false);
  };

  const handleManageVariants = (plantId: string) => {
    navigate(`/variants?plantId=${plantId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">All Plants</h3>
          <p className="text-muted-foreground">Manage your plant inventory</p>
        </div>
        <Button
          onClick={handleAddPlant}
          className="btn-primary flex items-center space-x-2"
          data-testid="button-add-plant"
        >
          <Add />
          <span>Add New Plant</span>
        </Button>
      </div>

      <PlantList onManageVariants={handleManageVariants} />

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Plant</DialogTitle>
          </DialogHeader>
          <PlantForm onSaved={handlePlantSaved} onCancel={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
