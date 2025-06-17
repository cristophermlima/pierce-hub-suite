
import { useState, useMemo } from 'react';
import { InventoryItem } from '../types';

export function useInventoryFilters(inventoryItems: InventoryItem[] = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category_id === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [inventoryItems, searchTerm, filterCategory]);

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filteredInventory
  };
}
