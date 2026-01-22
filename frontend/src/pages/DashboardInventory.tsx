import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Pencil, Trash2, Loader2, AlertTriangle, TrendingDown, PackageX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getInventoryAdmin,
  createInventory,
  updateInventory,
  deleteInventory,
  getHospitalsAdmin,
  getMedicinesAdmin,
  Inventory,
  Hospital,
  Medicine
} from '@/lib/api';

const DashboardInventory = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [formData, setFormData] = useState({
    hospital: 0,
    medicine: 0,
    current_stock: 0,
    reorder_level: 50,
    max_capacity: 1000,
    average_daily_usage: 10,
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryData, hospitalsData, medicinesData] = await Promise.all([
        getInventoryAdmin(),
        getHospitalsAdmin(),
        getMedicinesAdmin(),
      ]);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      setHospitals(Array.isArray(hospitalsData) ? hospitalsData : []);
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      hospital: 0,
      medicine: 0,
      current_stock: 0,
      reorder_level: 50,
      max_capacity: 1000,
      average_daily_usage: 10,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: Inventory) => {
    setEditingItem(item);
    setFormData({
      hospital: item.hospital,
      medicine: item.medicine,
      current_stock: item.current_stock || 0,
      reorder_level: item.reorder_level || 50,
      max_capacity: item.max_capacity || 1000,
      average_daily_usage: item.average_daily_usage || 10,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateInventory(editingItem.id, formData);
        toast({ title: 'Success', description: 'Inventory updated successfully' });
      } else {
        await createInventory(formData);
        toast({ title: 'Success', description: 'Inventory item created successfully' });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving inventory:', error);
      toast({ title: 'Error', description: 'Failed to save inventory', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;
    try {
      await deleteInventory(id);
      toast({ title: 'Success', description: 'Inventory item deleted successfully' });
      fetchData();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      toast({ title: 'Error', description: 'Failed to delete inventory', variant: 'destructive' });
    }
  };

  const getStockStatus = (item: Inventory) => {
    if (item.current_stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (item.current_stock <= item.reorder_level) return { label: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  const lowStockCount = inventory.filter(i => i.current_stock <= i.reorder_level && i.current_stock > 0).length;
  const outOfStockCount = inventory.filter(i => i.current_stock === 0).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">Manage hospital drug inventory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Inventory' : 'Add New Inventory'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Hospital *</Label>
                  <Select
                    value={formData.hospital.toString()}
                    onValueChange={(value) => setFormData({ ...formData, hospital: parseInt(value) })}
                    disabled={!!editingItem}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map((h) => (
                        <SelectItem key={h.id} value={h.id.toString()}>{h.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Medicine *</Label>
                  <Select
                    value={formData.medicine.toString()}
                    onValueChange={(value) => setFormData({ ...formData, medicine: parseInt(value) })}
                    disabled={!!editingItem}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Stock *</Label>
                    <Input
                      type="number"
                      value={formData.current_stock}
                      onChange={(e) => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reorder Level *</Label>
                    <Input
                      type="number"
                      value={formData.reorder_level}
                      onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Capacity</Label>
                    <Input
                      type="number"
                      value={formData.max_capacity}
                      onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Usage Avg</Label>
                    <Input
                      type="number"
                      value={formData.average_daily_usage}
                      onChange={(e) => setFormData({ ...formData, average_daily_usage: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-xl font-bold text-foreground">{inventory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-xl font-bold text-orange-600">{lowStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <PackageX className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-xl font-bold text-red-600">{outOfStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Inventory List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : inventory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No inventory items found. Add your first item!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.hospital_name || `Hospital ${item.hospital}`}</TableCell>
                        <TableCell>{item.medicine_name || `Medicine ${item.medicine}`}</TableCell>
                        <TableCell>{item.current_stock}</TableCell>
                        <TableCell>{item.reorder_level}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardInventory;
