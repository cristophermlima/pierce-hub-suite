
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Edit, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  threshold: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Titanium Barbells',
    category: 'Jewelry',
    stock: 15,
    price: 24.99,
    threshold: 10,
  },
  {
    id: '2',
    name: 'Steel Curved Barbells',
    category: 'Jewelry',
    stock: 8,
    price: 18.50,
    threshold: 10,
  },
  {
    id: '3',
    name: 'Niobium Captive Bead Rings',
    category: 'Jewelry',
    stock: 22,
    price: 29.99,
    threshold: 15,
  },
  {
    id: '4',
    name: 'Sterilization Pouches',
    category: 'Supplies',
    stock: 120,
    price: 0.45,
    threshold: 100,
  },
  {
    id: '5',
    name: 'Surgical Steel Labrets',
    category: 'Jewelry',
    stock: 35,
    price: 12.99,
    threshold: 20,
  },
  {
    id: '6',
    name: 'Sterile Gloves (Box)',
    category: 'Supplies',
    stock: 8,
    price: 15.99,
    threshold: 5,
  },
  {
    id: '7',
    name: 'Marking Pens',
    category: 'Tools',
    stock: 12,
    price: 5.99,
    threshold: 10,
  },
  {
    id: '8',
    name: 'Receiving Tubes',
    category: 'Tools',
    stock: 18,
    price: 22.50,
    threshold: 15,
  },
  {
    id: '9',
    name: 'Cleaning Solution (1L)',
    category: 'Supplies',
    stock: 6,
    price: 19.99,
    threshold: 5,
  },
];

const categories = ['Jewelry', 'Tools', 'Supplies', 'Aftercare'];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (selectedItem) {
      toast({
        title: "Inventory updated",
        description: `${selectedItem.name} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Item added",
        description: "New inventory item has been added successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-72">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input 
              placeholder="Search inventory..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={filterCategory} 
            onValueChange={setFilterCategory}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleAddItem}>
          <Plus size={18} className="mr-2" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const isLowStock = item.stock < item.threshold;
                const stockClass = isLowStock ? 'text-red-500 font-semibold' : '';
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className={`text-right ${stockClass}`}>
                      {item.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isLowStock ? (
                        <span className="bg-red-500/20 text-red-600 text-xs px-2 py-1 rounded-full">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full">
                          In Stock
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem 
                ? 'Update inventory item details.'
                : 'Fill in the details to add a new inventory item.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Item Name
              </label>
              <Input 
                id="name" 
                defaultValue={selectedItem?.name}
                placeholder="Item name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select defaultValue={selectedItem?.category || categories[0]}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity
                </label>
                <Input 
                  id="stock" 
                  type="number"
                  defaultValue={selectedItem?.stock}
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input 
                  id="price" 
                  type="number"
                  step="0.01"
                  defaultValue={selectedItem?.price}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="threshold" className="text-sm font-medium">
                Low Stock Threshold
              </label>
              <Input 
                id="threshold" 
                type="number"
                defaultValue={selectedItem?.threshold}
                placeholder="10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {selectedItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
