import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Supplier, SupplierFormData } from '../types';
import { getEffectiveUserId } from '@/lib/effectiveUser';

export const useSuppliers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers - RLS gerencia acesso
  const {
    data: suppliers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // RLS gerencia acesso - sem filtro de user_id
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
      const effectiveUserId = await getEffectiveUserId();

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
          notes: supplierData.notes,
          user_id: effectiveUserId
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

  // Update supplier mutation - RLS gerencia acesso
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

  // Delete supplier mutation - RLS gerencia acesso
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
