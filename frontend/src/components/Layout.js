import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Factory, 
  Warehouse, 
  Truck, 
  BarChart3, 
  QrCode,
  LogOut,
  Menu,
  X,
  Users
} from 'lucide-react';
import { authAPI } from '../services/api';
import { Button } from './ui/button';
import { toast } from 'sonner';

function Layout({ children, user, activePage }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const navItems = [
    { id: 'staff', label: 'Intake', icon: Package, path: '/staff', roles: ['staff', 'admin', 'owner'] },
    { id: 'processing', label: 'Processing', icon: Factory, path: '/processing', roles: ['staff', 'admin', 'owner'] },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, path: '/inventory', roles: ['staff', 'admin', 'owner'] },
    { id: 'dispatch', label: 'Dispatch', icon: Truck, path: '/dispatch', roles: ['staff', 'admin', 'owner'] },
    { id: 'scanner', label: 'QR Scanner', icon: QrCode, path: '/scanner', roles: ['staff', 'admin', 'owner'] },
    { id: 'admin', label: 'Dashboard', icon: BarChart3, path: '/admin', roles: ['admin', 'owner'] },
    { id: 'users', label: 'User Management', icon: Users, path: '/users', roles: ['admin', 'owner'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-heading font-bold">AquaFlow</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
          data-testid="mobile-menu-btn"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out z-40`}
          data-testid="sidebar"
        >
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-2xl font-heading font-bold">AquaFlow</h1>
            <p className="text-sm text-slate-400 mt-1 font-body">Processing Management</p>
          </div>

          <nav className="p-4 flex-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  data-testid={`nav-${item.id}`}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-150 relative z-10 ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="mb-4">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 uppercase mt-1">{user?.role}</p>
            </div>
            <Button
              data-testid="logout-btn"
              onClick={handleLogout}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;
