import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlantList } from '@/components/plants/PlantList';
import { BeautifulPlantForm } from '@/components/plants/BeautifulPlantForm';
import { BeautifulVariantModal } from '@/components/variants/BeautifulVariantModal';
import { Button } from '@/components/ui/button';
import { Plus, Leaf } from 'lucide-react';

export default function Plants() {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<{ id: string; name: string } | null>(null);

  const handleAddPlant = () => {
    setShowAddForm(true);
  };

  const handlePlantSaved = () => {
    setShowAddForm(false);
  };

  const handleManageVariants = (plantId: string, plantName: string) => {
    setSelectedPlant({ id: plantId, name: plantName });
    setShowVariantModal(true);
  };

  const handleCloseVariantModal = () => {
    setShowVariantModal(false);
    setSelectedPlant(null);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Plant Inventory</h1>
              <p className="text-gray-600 text-lg">Manage your beautiful plant collection</p>
            </div>
          </div>
          <Button
            onClick={handleAddPlant}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid="button-add-plant"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Plant
          </Button>
        </div>
      </div>

      <PlantList onManageVariants={handleManageVariants} />

      {/* Beautiful Plant Form Modal */}
      {showAddForm && (
        <BeautifulPlantForm
          onSaved={handlePlantSaved}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Beautiful Variant Modal */}
      {showVariantModal && selectedPlant && (
        <BeautifulVariantModal
          plantId={selectedPlant.id}
          plantName={selectedPlant.name}
          onClose={handleCloseVariantModal}
        />
      )}
    </div>
  );
}
