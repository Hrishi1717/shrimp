import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { batchAPI, processingAPI } from '../services/api';
import { toast } from 'sonner';
import { Factory, Plus } from 'lucide-react';

const STAGES = ['Washing', 'Peeling', 'Grading', 'Packing'];

function ProcessingDashboard({ user }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [stages, setStages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batch_id: '',
    stage_name: '',
    assigned_person: '',
    input_weight: '',
    output_weight: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchStages(selectedBatch);
    }
  }, [selectedBatch]);

  const fetchBatches = async () => {
    try {
      const data = await batchAPI.getBatches();
      setBatches(data.filter(b => ['RECEIVED', 'PROCESSED'].includes(b.status)));
    } catch (error) {
      toast.error('Failed to load batches');
    }
  };

  const fetchStages = async (batchId) => {
    try {
      const data = await processingAPI.getStagesByBatch(batchId);
      setStages(data);
    } catch (error) {
      toast.error('Failed to load stages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await processingAPI.createStage({
        ...formData,
        input_weight: parseFloat(formData.input_weight),
        output_weight: parseFloat(formData.output_weight),
      });

      toast.success('Processing stage added successfully!');
      setFormData({
        batch_id: '',
        stage_name: '',
        assigned_person: '',
        input_weight: '',
        output_weight: '',
      });
      setShowForm(false);
      fetchBatches();
      if (selectedBatch) fetchStages(selectedBatch);
    } catch (error) {
      toast.error('Failed to add processing stage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} activePage="processing">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
              Processing Stages
            </h1>
            <p className="text-slate-600 mt-1">Track washing, peeling, grading, and packing</p>
          </div>
          <Button
            data-testid="add-stage-btn"
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus size={20} className="mr-2" />
            {showForm ? 'Cancel' : 'Add Stage'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold">Add Processing Stage</CardTitle>
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
                    <Label>Stage Name</Label>
                    <Select
                      value={formData.stage_name}
                      onValueChange={(value) => setFormData({ ...formData, stage_name: value })}
                    >
                      <SelectTrigger data-testid="stage-select" className="mt-1">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Assigned Person</Label>
                    <Input
                      data-testid="assigned-person-input"
                      required
                      value={formData.assigned_person}
                      onChange={(e) => setFormData({ ...formData, assigned_person: e.target.value })}
                      placeholder="Worker name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Input Weight (kg)</Label>
                    <Input
                      data-testid="input-weight-input"
                      type="number"
                      step="0.01"
                      required
                      value={formData.input_weight}
                      onChange={(e) => setFormData({ ...formData, input_weight: e.target.value })}
                      placeholder="Input weight"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Output Weight (kg)</Label>
                    <Input
                      data-testid="output-weight-input"
                      type="number"
                      step="0.01"
                      required
                      value={formData.output_weight}
                      onChange={(e) => setFormData({ ...formData, output_weight: e.target.value })}
                      placeholder="Output weight"
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
                    data-testid="submit-stage-btn"
                  >
                    {loading ? 'Adding...' : 'Add Stage'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Batch Selection */}
        <Card className="mb-8 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-heading font-semibold">Select Batch to View Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBatch || ''} onValueChange={setSelectedBatch}>
              <SelectTrigger data-testid="view-batch-select">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.batch_id} value={batch.batch_id}>
                    {batch.batch_id} - {batch.size_grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stages Display */}
        {selectedBatch && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold">Processing Stages for {selectedBatch}</CardTitle>
            </CardHeader>
            <CardContent>
              {stages.length > 0 ? (
                <div className="space-y-4">
                  {STAGES.map((stageName) => {
                    const stage = stages.find((s) => s.stage_name === stageName);
                    const yieldPct = stage ? ((stage.output_weight / stage.input_weight) * 100).toFixed(2) : 0;

                    return (
                      <div
                        key={stageName}
                        className={`border rounded-lg p-4 ${
                          stage ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
                        }`}
                        data-testid={`stage-${stageName.toLowerCase()}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-heading font-semibold text-lg text-slate-900">{stageName}</h3>
                            {stage ? (
                              <div className="mt-2 space-y-1 text-sm text-slate-600">
                                <p>Assigned: <span className="font-semibold">{stage.assigned_person}</span></p>
                                <p>Input: <span className="font-semibold">{stage.input_weight} kg</span></p>
                                <p>Output: <span className="font-semibold">{stage.output_weight} kg</span></p>
                                <p>Wastage: <span className="font-semibold text-red-600">{stage.wastage} kg</span></p>
                                <p>Yield: <span className="font-semibold text-green-600">{yieldPct}%</span></p>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 mt-2">Not started</p>
                            )}
                          </div>
                          <span
                            className={`status-badge ${
                              stage ? 'status-processed' : 'status-pending'
                            }`}
                          >
                            {stage ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Factory className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <p>No processing stages recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default ProcessingDashboard;
