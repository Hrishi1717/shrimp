import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { batchAPI, inventoryAPI } from '../services/api';
import { toast } from 'sonner';
import { Warehouse, Plus } from 'lucide-react';

function InventoryDashboard({ user }) {
  const [batches, setBatches] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batch_id: '',
    location: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesData, inventoryData] = await Promise.all([
        batchAPI.getBatches(),
        inventoryAPI.getInventory(),
      ]);
      setBatches(batchesData.filter(b => b.status === 'PROCESSED'));
      setInventory(inventoryData);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await inventoryAPI.createInventory({
        ...formData,
        quantity: parseFloat(formData.quantity),
      });

      toast.success('Added to inventory successfully!');
      setFormData({ batch_id: '', location: '', quantity: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to add to inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} activePage="inventory">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
              Cold Storage & Inventory
            </h1>
            <p className="text-slate-600 mt-1">Manage storage locations and stock</p>
          </div>
          <Button
            data-testid="add-inventory-btn"
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            {showForm ? 'Cancel' : 'Add to Inventory'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold">Add to Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Batch ID</Label>
                    <Select
                      value={formData.batch_id}
                      onValueChange={(value) => setFormData({ ...formData, batch_id: value })}
                    >
                      <SelectTrigger data-testid="batch-select" className="mt-1">
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.batch_id} value={batch.batch_id}>
                            {batch.batch_id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Storage Location</Label>
                    <Input
                      data-testid="location-input"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Cold Room A"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Quantity (kg)</Label>
                    <Input
                      data-testid="quantity-input"
                      type="number"
                      step="0.01"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Quantity"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                    data-testid="submit-inventory-btn"
                  >
                    {loading ? 'Adding...' : 'Add to Inventory'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Inventory List */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold">Current Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Batch ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Location</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Quantity (kg)</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Batch Age (days)</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.inventory_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-mono text-slate-900 font-semibold">{item.batch_id}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{item.location}</td>
                        <td className="py-3 px-4 text-sm text-right text-slate-900">{item.quantity}</td>
                        <td className="py-3 px-4 text-sm text-center text-slate-900">{item.batch_age}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="status-badge status-stored">{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Warehouse className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No inventory items yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default InventoryDashboard;
