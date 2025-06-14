import React, { useState } from 'react';
import { useInventory } from '@/features/inventory/hooks/useInventory';
import { InventoryFilters } from '@/features/inventory/components/InventoryFilters';
import { InventoryTable } from '@/features/inventory/components/InventoryTable';
import { InventoryDialog } from '@/features/inventory/components/InventoryDialog';
import { InventoryLoading } from '@/features/inventory/components/InventoryLoading';
import { Button } from "@/components/ui/button";
import { useCustomFields } from '@/features/inventory/hooks/useCustomFields';
import { CustomFieldsTable } from '@/features/inventory/components/CustomFieldsTable';
import { CustomFieldDialog } from '@/features/inventory/components/CustomFieldDialog';

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

  const {
    fields,
    createField,
    editField,
    deleteField,
    isLoading: fieldsLoading,
    creating,
    editing,
  } = useCustomFields();

  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Estoque</h1>
      </div>

      {/* NOVA SESSÃO: GERENCIAR CAMPOS CUSTOMIZADOS */}
      <div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Campos Customizados</span>
          <Button onClick={() => { setFieldDialogOpen(true); setFieldToEdit(null); }}>Novo Campo</Button>
        </div>
        <CustomFieldsTable
          fields={fields}
          onEdit={(fld) => { setFieldToEdit(fld); setFieldDialogOpen(true); }}
          onDelete={deleteField}
        />
        <CustomFieldDialog
          open={fieldDialogOpen}
          onOpenChange={setFieldDialogOpen}
          onSave={fieldToEdit ? (data) => editField({ id: fieldToEdit.id, field: data }) : createField}
          loading={creating || editing}
          defaultValues={fieldToEdit}
        />
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
