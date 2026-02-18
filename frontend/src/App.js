import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import FarmerDashboard from './pages/FarmerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProcessingDashboard from './pages/ProcessingDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import DispatchDashboard from './pages/DispatchDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BatchDetails from './pages/BatchDetails';
import QRScanner from './pages/QRScanner';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/farmer" element={
        <ProtectedRoute allowedRoles={['farmer']}>
          <FarmerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <StaffDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/processing" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <ProcessingDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <InventoryDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dispatch" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <DispatchDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/batch/:batchId" element={
        <ProtectedRoute allowedRoles={['farmer', 'staff', 'admin']}>
          <BatchDetails />
        </ProtectedRoute>
      } />
      
      <Route path="/scanner" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <QRScanner />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
