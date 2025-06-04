
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
    jewelryMaterials,
    threadTypes,
    suppliers,
    filteredInventory,
    isLoading,
    inventoryMutation,
    handleAddItem,
    handleEditItem,
    handleSaveItem
  } = useInventory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Estoque</h1>
      </div>

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
        jewelryMaterials={jewelryMaterials}
        threadTypes={threadTypes}
        suppliers={suppliers}
        isSubmitting={inventoryMutation.isPending}
        onSubmit={handleSaveItem}
      />
    </div>
  );
};

export default Inventory;
