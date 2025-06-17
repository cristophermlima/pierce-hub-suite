
import { useState } from 'react';
import { InventoryItem } from '../types';

export function useInventoryDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedItem,
    setSelectedItem,
    handleAddItem,
    handleEditItem,
    closeDialog
  };
}
