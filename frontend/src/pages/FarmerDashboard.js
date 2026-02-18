import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmerAPI, authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { DollarSign, Package, TrendingUp, AlertCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

function FarmerDashboard({ user: propUser }) {
  const navigate = useNavigate();
  const [user] = useState(propUser);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await farmerAPI.getFarmerStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch farmer stats:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">
              Farmer Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Button
            data-testid="logout-btn"
            onClick={handleLogout}
            variant="outline"
            className="border-slate-300"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="p-6 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="total-batches-card" className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Batches
              </CardTitle>
              <Package className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900">
                {stats?.total_batches || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="total-supply-card" className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Prawns Supplied
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-slate-900">
                {stats?.total_prawns_supplied?.toFixed(2) || '0.00'} kg
              </div>
            </CardContent>
          </Card>

          <Card data-testid="total-payments-card" className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Payments Received
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-green-600">
                ${stats?.total_payments?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="pending-payments-card" className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Pending Payments
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-heading font-bold text-orange-500">
                ${stats?.pending_payments?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold text-slate-900">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.payments && stats.payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Payment ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Batch ID</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Prawns (kg)</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Price/kg</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Gross Amount</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Deductions</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Net Amount</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.payments.map((payment) => (
                      <tr key={payment.payment_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-mono text-slate-600">{payment.payment_id}</td>
                        <td className="py-3 px-4 text-sm font-mono text-slate-600">{payment.batch_id}</td>
                        <td className="py-3 px-4 text-sm text-right text-slate-900">{payment.total_prawns.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-right text-slate-900">${payment.price_per_kg.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-right text-slate-900 font-semibold">${payment.gross_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-right text-red-600">-${payment.deductions.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">${payment.net_amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`status-badge ${payment.payment_status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                            {payment.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No payment records found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FarmerDashboard;
