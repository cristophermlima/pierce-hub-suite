
import React, { useState } from 'react';
import { useInventory } from '@/features/inventory/hooks/useInventory';
import { InventoryFilters } from '@/features/inventory/components/InventoryFilters';
import { InventoryTable } from '@/features/inventory/components/InventoryTable';
import { InventoryDialog } from '@/features/inventory/components/InventoryDialog';
import { InventoryLoading } from '@/features/inventory/components/InventoryLoading';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomFields } from '@/features/inventory/hooks/useCustomFields';
import { CustomFieldsTable } from '@/features/inventory/components/CustomFieldsTable';
import { CustomFieldDialog } from '@/features/inventory/components/CustomFieldDialog';

// Aftercare imports
import { useAftercareTemplates } from '@/features/aftercare/hooks/useAftercareTemplates';
import { AftercareTemplateDialog } from '@/features/aftercare/components/AftercareTemplateDialog';
import { AftercareTemplatesTable } from '@/features/aftercare/components/AftercareTemplatesTable';
import { AftercarePreviewDialog } from '@/features/aftercare/components/AftercarePreviewDialog';
import { AftercareTemplate } from '@/features/aftercare/types';

// Sterilized materials imports
import { useSterilizedMaterials } from '@/features/sterilized-materials/hooks/useSterilizedMaterials';
import { SterilizedMaterialDialog } from '@/features/sterilized-materials/components/SterilizedMaterialDialog';
import { SterilizedMaterialsTable } from '@/features/sterilized-materials/components/SterilizedMaterialsTable';
import { SterilizedMaterial } from '@/features/sterilized-materials/types';

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
    threadSpecifications,
    ringClosures,
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

  // Aftercare states
  const {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isCreating: isCreatingTemplate,
    isUpdating: isUpdatingTemplate
  } = useAftercareTemplates();

  // Sterilized materials states
  const {
    materials,
    createMaterial,
    updateMaterial,
    useMaterial,
    deleteMaterial,
    isCreating: isCreatingMaterial,
    isUpdating: isUpdatingMaterial
  } = useSterilizedMaterials();

  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<any>(null);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<AftercareTemplate | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState<AftercareTemplate | null>(null);

  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<SterilizedMaterial | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventário & Gestão</h1>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="sterilized">Materiais Esterilizados</TabsTrigger>
          <TabsTrigger value="aftercare">Cuidados Pós-Procedimento</TabsTrigger>
          <TabsTrigger value="custom-fields">Campos Customizados</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="sterilized" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Materiais Esterilizados</h3>
              <p className="text-sm text-muted-foreground">
                Controle de kits e ferramentas esterilizadas
              </p>
            </div>
            <Button onClick={() => { setMaterialDialogOpen(true); setMaterialToEdit(null); }}>
              Adicionar Material
            </Button>
          </div>

          <SterilizedMaterialsTable
            materials={materials}
            onEdit={(material) => { setMaterialToEdit(material); setMaterialDialogOpen(true); }}
            onDelete={deleteMaterial}
            onUse={useMaterial}
          />
        </TabsContent>

        <TabsContent value="aftercare" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Templates de Cuidados</h3>
              <p className="text-sm text-muted-foreground">
                Mensagens automáticas enviadas 2h após procedimentos
              </p>
            </div>
            <Button onClick={() => { setTemplateDialogOpen(true); setTemplateToEdit(null); }}>
              Novo Template
            </Button>
          </div>

          <AftercareTemplatesTable
            templates={templates}
            onEdit={(template) => { setTemplateToEdit(template); setTemplateDialogOpen(true); }}
            onDelete={deleteTemplate}
            onPreview={(template) => { setTemplateToPreview(template); setPreviewDialogOpen(true); }}
          />
        </TabsContent>

        <TabsContent value="custom-fields" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Campos Customizados</h3>
            <Button onClick={() => { setFieldDialogOpen(true); setFieldToEdit(null); }}>Novo Campo</Button>
          </div>
          <CustomFieldsTable
            fields={fields}
            onEdit={(fld) => { setFieldToEdit(fld); setFieldDialogOpen(true); }}
            onDelete={deleteField}
          />
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <InventoryDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        categories={categories}
        jewelryMaterials={jewelryMaterials}
        threadTypes={threadTypes}
        threadSpecifications={threadSpecifications}
        ringClosures={ringClosures}
        suppliers={suppliers}
        isSubmitting={inventoryMutation.isPending}
        onSubmit={handleSaveItem}
      />

      <CustomFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        onSave={fieldToEdit ? (data) => editField({ id: fieldToEdit.id, field: data }) : createField}
        loading={creating || editing}
        defaultValues={fieldToEdit}
      />

      <AftercareTemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        template={templateToEdit}
        onSave={templateToEdit ? (data) => updateTemplate({ id: templateToEdit.id, data }) : createTemplate}
        isSubmitting={isCreatingTemplate || isUpdatingTemplate}
      />

      <AftercarePreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        template={templateToPreview}
      />

      <SterilizedMaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        material={materialToEdit}
        onSave={materialToEdit ? (data) => updateMaterial({ id: materialToEdit.id, data }) : createMaterial}
        isSubmitting={isCreatingMaterial || isUpdatingMaterial}
      />
    </div>
  );
};

export default Inventory;
