import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { farmerAPI, batchAPI } from '../services/api';
import { toast } from 'sonner';
import { Package, Plus, QrCode as QrCodeIcon } from 'lucide-react';

function StaffDashboard({ user }) {
  const [farmers, setFarmers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    farmer_id: '',
    weight_kg: '',
    size_grade: '',
    location: '',
  });
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [showNewFarmerForm, setShowNewFarmerForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [farmersData, batchesData] = await Promise.all([
        farmerAPI.getFarmers(),
        batchAPI.getBatches(),
      ]);
      setFarmers(farmersData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const batch = await batchAPI.createBatch({
        ...formData,
        weight_kg: parseFloat(formData.weight_kg),
      });

      toast.success('Batch created successfully!');
      setFormData({
        farmer_id: '',
        weight_kg: '',
        size_grade: '',
        location: '',
      });
      setShowForm(false);
      fetchData();

      // Show QR code
      if (batch.qr_code) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-lg p-8 max-w-md">
            <h3 class="text-2xl font-heading font-bold text-slate-900 mb-4">Batch Created!</h3>
            <p class="text-slate-600 mb-4">Batch ID: <span class="font-mono font-semibold">${batch.batch_id}</span></p>
            <div class="flex justify-center mb-6">
              <img src="${batch.qr_code}" alt="QR Code" class="w-64 h-64" />
            </div>
            <button class="w-full bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-800 transition-colors" onclick="this.parentElement.parentElement.remove()">
              Close
            </button>
          </div>
        `;
        document.body.appendChild(modal);
      }
    } catch (error) {
      console.error('Failed to create batch:', error);
      toast.error(error.response?.data?.detail || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarmer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await farmerAPI.createFarmer(newFarmer);
      toast.success('Farmer created successfully!');
      setNewFarmer({ name: '', contact: '', address: '' });
      setShowNewFarmerForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create farmer:', error);
      toast.error('Failed to create farmer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} activePage="staff">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
              Raw Material Intake
            </h1>
            <p className="text-slate-600 mt-1">Create and manage batch entries</p>
          </div>
          <Button
            data-testid="create-batch-btn"
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            {showForm ? 'Cancel' : 'New Batch'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold">Create New Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="farmer_id">Farmer / Supplier</Label>
                    <div className="flex gap-2 mt-1">
                      <Select
                        value={formData.farmer_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, farmer_id: value })
                        }
                      >
                        <SelectTrigger data-testid="farmer-select" className="flex-1">
                          <SelectValue placeholder="Select farmer" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmers.map((farmer) => (
                            <SelectItem key={farmer.farmer_id} value={farmer.farmer_id}>
                              {farmer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={() => setShowNewFarmerForm(!showNewFarmerForm)}
                        variant="outline"
                        data-testid="add-farmer-btn"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      data-testid="weight-input"
                      type="number"
                      step="0.01"
                      required
                      value={formData.weight_kg}
                      onChange={(e) =>
                        setFormData({ ...formData, weight_kg: e.target.value })
                      }
                      placeholder="Enter weight in kg"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="size_grade">Size Grade</Label>
                    <Select
                      value={formData.size_grade}
                      onValueChange={(value) =>
                        setFormData({ ...formData, size_grade: value })
                      }
                    >
                      <SelectTrigger data-testid="size-grade-select" className="mt-1">
                        <SelectValue placeholder="Select size grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Small">Small (20-30 count/kg)</SelectItem>
                        <SelectItem value="Medium">Medium (15-20 count/kg)</SelectItem>
                        <SelectItem value="Large">Large (10-15 count/kg)</SelectItem>
                        <SelectItem value="Jumbo">Jumbo (5-10 count/kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      data-testid="location-input"
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Receiving location"
                      className="mt-1"
                    />
                  </div>
                </div>

                {showNewFarmerForm && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Add New Farmer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Farmer name"
                        data-testid="new-farmer-name"
                        value={newFarmer.name}
                        onChange={(e) =>
                          setNewFarmer({ ...newFarmer, name: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Contact number"
                        data-testid="new-farmer-contact"
                        value={newFarmer.contact}
                        onChange={(e) =>
                          setNewFarmer({ ...newFarmer, contact: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Address"
                        data-testid="new-farmer-address"
                        value={newFarmer.address}
                        onChange={(e) =>
                          setNewFarmer({ ...newFarmer, address: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleCreateFarmer}
                      disabled={loading}
                      className="mt-4"
                      data-testid="create-farmer-btn"
                    >
                      Add Farmer
                    </Button>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                    data-testid="submit-batch-btn"
                  >
                    {loading ? 'Creating...' : 'Create Batch'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Batches List */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold">Recent Batches</CardTitle>
          </CardHeader>
          <CardContent>
            {batches.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Batch ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Farmer</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Weight (kg)</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Size Grade</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">QR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.slice(0, 20).map((batch) => (
                      <tr key={batch.batch_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-mono text-slate-900 font-semibold">{batch.batch_id}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{batch.farmer_id}</td>
                        <td className="py-3 px-4 text-sm text-right text-slate-900">{batch.weight_kg}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{batch.size_grade}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{batch.location}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(batch.intake_date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`status-badge status-${batch.status.toLowerCase()}`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                              modal.innerHTML = `
                                <div class="bg-white rounded-lg p-8 max-w-md">
                                  <h3 class="text-2xl font-heading font-bold text-slate-900 mb-4">Batch QR Code</h3>
                                  <p class="text-slate-600 mb-4">Batch ID: <span class="font-mono font-semibold">${batch.batch_id}</span></p>
                                  <div class="flex justify-center mb-6">
                                    <img src="${batch.qr_code}" alt="QR Code" class="w-64 h-64" />
                                  </div>
                                  <button class="w-full bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-800 transition-colors" onclick="this.parentElement.parentElement.remove()">
                                    Close
                                  </button>
                                </div>
                              `;
                              document.body.appendChild(modal);
                            }}
                            className="text-slate-600 hover:text-slate-900"
                            data-testid={`qr-btn-${batch.batch_id}`}
                          >
                            <QrCodeIcon size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No batches yet. Create your first batch!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default StaffDashboard;
