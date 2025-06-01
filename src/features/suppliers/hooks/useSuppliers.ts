
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Supplier, SupplierFormData } from '../types';

export const useSuppliers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers
  const {
    data: suppliers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Supplier[];
    }
  });

  // Add supplier mutation
  const addSupplierMutation = useMutation({
    mutationFn: async (supplierData: SupplierFormData) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          name: supplierData.name,
          contact_name: supplierData.contactName,
          phone: supplierData.phone,
          email: supplierData.email,
          category: supplierData.category,
          address: supplierData.address,
          city: supplierData.city,
          state: supplierData.state,
          zip_code: supplierData.zipCode,
          notes: supplierData.notes
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Fornecedor adicionado",
        description: "Novo fornecedor adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar fornecedor: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, ...supplierData }: SupplierFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update({
          name: supplierData.name,
          contact_name: supplierData.contactName,
          phone: supplierData.phone,
          email: supplierData.email,
          category: supplierData.category,
          address: supplierData.address,
          city: supplierData.city,
          state: supplierData.state,
          zip_code: supplierData.zipCode,
          notes: supplierData.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Fornecedor atualizado",
        description: "As informações do fornecedor foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar fornecedor: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Delete supplier mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Fornecedor removido",
        description: "Fornecedor removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover fornecedor: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    suppliers,
    isLoading,
    error,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
    isAddingSupplier: addSupplierMutation.isPending,
    isUpdatingSupplier: updateSupplierMutation.isPending,
    isDeletingSupplier: deleteSupplierMutation.isPending,
  };
};
