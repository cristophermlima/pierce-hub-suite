
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SuppliersHeader, SuppliersTable, SupplierDialog } from "@/features/suppliers/components";
import { useSuppliers } from "@/features/suppliers/hooks";
import { Supplier, SupplierFormData } from "@/features/suppliers/types";
import { useTranslation } from '@/hooks/useTranslation';

const Suppliers = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const {
    suppliers,
    isLoading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    isAddingSupplier,
    isUpdatingSupplier,
    isDeletingSupplier,
  } = useSuppliers();

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery) return suppliers;
    
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  const handleNewSupplier = () => {
    setSelectedSupplier(null);
    setIsDialogOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleSupplierSubmit = (data: SupplierFormData & { id?: string }) => {
    if (data.id) {
      updateSupplier(data as SupplierFormData & { id: string });
    } else {
      addSupplier(data);
    }
  };

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm(t('confirmDeleteSupplier'))) {
      deleteSupplier(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SuppliersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewSupplier={handleNewSupplier}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('suppliersTitle')}</CardTitle>
          <CardDescription>{t('suppliersDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? t('noSuppliersFound') : t('noSuppliersRegistered')}
            </div>
          ) : (
            <SuppliersTable
              suppliers={filteredSuppliers}
              onEditSupplier={handleEditSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              isDeleting={isDeletingSupplier}
            />
          )}
        </CardContent>
      </Card>
      
      <SupplierDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        selectedSupplier={selectedSupplier}
        onSubmit={handleSupplierSubmit}
        isSubmitting={isAddingSupplier || isUpdatingSupplier}
      />
    </div>
  );
};

export default Suppliers;
