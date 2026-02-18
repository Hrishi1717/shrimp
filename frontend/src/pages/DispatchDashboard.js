import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { batchAPI, dispatchAPI } from '../services/api';
import { toast } from 'sonner';
import { Truck, Plus } from 'lucide-react';

function DispatchDashboard({ user }) {
  const [batches, setBatches] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batch_id: '',
    customer_name: '',
    country: '',
    selling_price: '',
    dispatch_date: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesData, dispatchesData] = await Promise.all([
        batchAPI.getBatches(),
        dispatchAPI.getDispatches(),
      ]);
      setBatches(batchesData.filter(b => b.status === 'STORED'));
      setDispatches(dispatchesData);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatchAPI.createDispatch({
        ...formData,
        selling_price: parseFloat(formData.selling_price),
        dispatch_date: new Date(formData.dispatch_date).toISOString(),
      });

      toast.success('Dispatch created successfully!');
      setFormData({
        batch_id: '',
        customer_name: '',
        country: '',
        selling_price: '',
        dispatch_date: '',
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to create dispatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} activePage="dispatch">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
              Dispatch & Export
            </h1>
            <p className="text-slate-600 mt-1">Manage customer orders and shipping</p>
          </div>
          <Button
            data-testid="create-dispatch-btn"
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            {showForm ? 'Cancel' : 'Create Dispatch'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold">Create New Dispatch</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label>Customer Name</Label>
                    <Input
                      data-testid="customer-name-input"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="Customer name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Country</Label>
                    <Input
                      data-testid="country-input"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Destination country"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Selling Price ($)</Label>
                    <Input
                      data-testid="selling-price-input"
                      type="number"
                      step="0.01"
                      required
                      value={formData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                      placeholder="Price"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Dispatch Date</Label>
                    <Input
                      data-testid="dispatch-date-input"
                      type="datetime-local"
                      required
                      value={formData.dispatch_date}
                      onChange={(e) => setFormData({ ...formData, dispatch_date: e.target.value })}
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
                    data-testid="submit-dispatch-btn"
                  >
                    {loading ? 'Creating...' : 'Create Dispatch'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Dispatches List */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold">Recent Dispatches</CardTitle>
          </CardHeader>
          <CardContent>
            {dispatches.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Dispatch ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Batch ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Country</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Dispatch Date</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatches.map((dispatch) => (
                      <tr key={dispatch.dispatch_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-mono text-slate-900 font-semibold">{dispatch.dispatch_id}</td>
                        <td className="py-3 px-4 text-sm font-mono text-slate-600">{dispatch.batch_id}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{dispatch.customer_name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{dispatch.country}</td>
                        <td className="py-3 px-4 text-sm text-right text-slate-900 font-semibold">
                          ${dispatch.selling_price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(dispatch.dispatch_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="status-badge status-shipped">{dispatch.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Truck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No dispatches yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default DispatchDashboard;
