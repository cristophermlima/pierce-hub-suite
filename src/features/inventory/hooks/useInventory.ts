
import { InventoryMutationData } from '../types';
import { useInventoryData } from './useInventoryData';
import { useInventoryFilters } from './useInventoryFilters';
import { useInventoryDialog } from './useInventoryDialog';
import { useInventoryMetadata } from './useInventoryMetadata';
import { useInventoryMutation } from './useInventoryMutation';

export function useInventory() {
  const { data: inventoryItems, isLoading } = useInventoryData();
  const metadata = useInventoryMetadata();
  const filters = useInventoryFilters(inventoryItems);
  const dialog = useInventoryDialog();
  
  const inventoryMutation = useInventoryMutation({
    selectedItem: dialog.selectedItem,
    onSuccess: dialog.closeDialog
  });

  const handleSaveItem = (formData: InventoryMutationData) => {
    inventoryMutation.mutate(formData);
  };

  return {
    ...filters,
    ...dialog,
    ...metadata,
    inventoryItems,
    isLoading,
    inventoryMutation,
    handleSaveItem
  };
}
