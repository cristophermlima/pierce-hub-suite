
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Category, 
  JewelryMaterial, 
  ThreadType, 
  ThreadSpecification,
  RingClosure,
  Supplier
} from '../types';

export function useInventoryMetadata() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [jewelryMaterials, setJewelryMaterials] = useState<JewelryMaterial[]>([]);
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>([]);
  const [threadSpecifications, setThreadSpecifications] = useState<ThreadSpecification[]>([]);
  const [ringClosures, setRingClosures] = useState<RingClosure[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('type, name');
        
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error('Não foi possível carregar as categorias');
      }
    };

    fetchCategories();
  }, []);

  // Fetch jewelry materials
  useEffect(() => {
    const fetchJewelryMaterials = async () => {
      try {
        const { data, error } = await supabase
          .from('jewelry_materials')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setJewelryMaterials(data);
        }
      } catch (error) {
        console.error('Erro ao buscar materiais:', error);
        toast.error('Não foi possível carregar os materiais');
      }
    };

    fetchJewelryMaterials();
  }, []);

  // Fetch thread types
  useEffect(() => {
    const fetchThreadTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('thread_types')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setThreadTypes(data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de rosca:', error);
        toast.error('Não foi possível carregar os tipos de rosca');
      }
    };

    fetchThreadTypes();
  }, []);

  // Fetch thread specifications
  useEffect(() => {
    const fetchThreadSpecifications = async () => {
      try {
        const { data, error } = await supabase
          .from('thread_specifications')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setThreadSpecifications(data);
        }
      } catch (error) {
        console.error('Erro ao buscar especificações de rosca:', error);
        toast.error('Não foi possível carregar as especificações de rosca');
      }
    };

    fetchThreadSpecifications();
  }, []);

  // Fetch ring closures
  useEffect(() => {
    const fetchRingClosures = async () => {
      try {
        const { data, error } = await supabase
          .from('ring_closures')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setRingClosures(data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de fechamento:', error);
        toast.error('Não foi possível carregar os tipos de fechamento');
      }
    };

    fetchRingClosures();
  }, []);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('suppliers')
          .select('id, name')
          .eq('user_id', user.id)
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setSuppliers(data);
        }
      } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        toast.error('Não foi possível carregar os fornecedores');
      }
    };

    fetchSuppliers();
  }, []);

  return {
    categories,
    jewelryMaterials,
    threadTypes,
    threadSpecifications,
    ringClosures,
    suppliers
  };
}
