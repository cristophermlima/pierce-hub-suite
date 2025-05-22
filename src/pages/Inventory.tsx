
import React from 'react';
import { useInventory } from '@/features/inventory/hooks/useInventory';
import { InventoryFilters } from '@/features/inventory/components/InventoryFilters';
import { InventoryTable } from '@/features/inventory/components/InventoryTable';
import { InventoryDialog } from '@/features/inventory/components/InventoryDialog';
import { InventoryLoading } from '@/features/inventory/components/InventoryLoading';

const Inventory = () => {
  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    isDialogOpen,
    setIsDialogOpen,
    selectedItem,
    categories,
    filteredInventory,
    isLoading,
    inventoryMutation,
    handleAddItem,
    handleEditItem,
    handleSaveItem
  } = useInventory();

  return (
    <div className="space-y-6">
      <InventoryFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        categories={categories}
        onAddItem={handleAddItem}
      />

      {isLoading ? (
        <InventoryLoading />
      ) : (
        <InventoryTable 
          items={filteredInventory} 
          onEditItem={handleEditItem} 
        />
      )}

      <InventoryDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        categories={categories}
        isSubmitting={inventoryMutation.isPending}
        onSubmit={handleSaveItem}
      />
    </div>
  );
};

export default Inventory;
