import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { dashboardAPI, exportAPI } from '../services/api';
import { toast } from 'sonner';
import { TrendingUp, DollarSign, Package, Users, Download } from 'lucide-react';

function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardAPI.getAdminDashboard();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    setExporting(true);
    try {
      if (type === 'batches') await exportAPI.exportBatches();
      else if (type === 'payments') await exportAPI.exportPayments();
      else if (type === 'processing') await exportAPI.exportProcessing();
      toast.success('Export completed successfully!');
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <Layout user={user} activePage="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} activePage="admin">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Overview of all operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Procurement</CardTitle>
              <Package className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900">
                {stats?.total_procurement?.toFixed(2) || '0'} kg
              </div>
              <p className="text-xs text-slate-500 mt-2">{stats?.total_batches || 0} batches</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Yield %</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-green-600">
                {stats?.yield_percentage?.toFixed(2) || '0'}%
              </div>
              <p className="text-xs text-slate-500 mt-2">Processing efficiency</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Payments</CardTitle>
              <DollarSign className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900">
                ${stats?.total_payments?.toFixed(2) || '0'}
              </div>
              <p className="text-xs text-orange-500 mt-2">
                Pending: ${stats?.pending_payments?.toFixed(2) || '0'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Selling Price</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-green-600">
                ${stats?.avg_selling_price?.toFixed(2) || '0'}
              </div>
              <p className="text-xs text-slate-500 mt-2">{stats?.total_dispatches || 0} dispatches</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Farmers</p>
                  <p className="text-2xl font-heading font-bold text-slate-900">{stats?.total_farmers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Batches</p>
                  <p className="text-2xl font-heading font-bold text-slate-900">{stats?.total_batches || 0}</p>
                </div>
                <Package className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Dispatches</p>
                  <p className="text-2xl font-heading font-bold text-slate-900">{stats?.total_dispatches || 0}</p>
                </div>
                <Package className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold">Export Data to Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                data-testid="export-batches-btn"
                onClick={() => handleExport('batches')}
                disabled={exporting}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Download size={16} className="mr-2" />
                Export Batches
              </Button>
              <Button
                data-testid="export-payments-btn"
                onClick={() => handleExport('payments')}
                disabled={exporting}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Download size={16} className="mr-2" />
                Export Payments
              </Button>
              <Button
                data-testid="export-processing-btn"
                onClick={() => handleExport('processing')}
                disabled={exporting}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Download size={16} className="mr-2" />
                Export Processing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
