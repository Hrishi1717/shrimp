import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, UserPlus, Mail, Shield, Briefcase, Tractor, Crown } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const ROLES = [
  { value: 'owner', label: 'Owner', icon: Crown, color: 'purple', description: 'Full system access & user management' },
  { value: 'admin', label: 'Admin', icon: Shield, color: 'blue', description: 'Analytics, reports & operations' },
  { value: 'staff', label: 'Staff', icon: Briefcase, color: 'green', description: 'Daily operations & data entry' },
  { value: 'farmer', label: 'Farmer', icon: Tractor, color: 'orange', description: 'View own supplies & payments' },
];

function UserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [linkFormData, setLinkFormData] = useState({
    user_id: '',
    farmer_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, farmersRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { withCredentials: true }),
        axios.get(`${API_URL}/farmers`, { withCredentials: true }),
      ]);
      setUsers(usersRes.data);
      setFarmers(farmersRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(
        `${API_URL}/users/invite`,
        { email: inviteEmail, role: inviteRole },
        { withCredentials: true }
      );
      
      toast.success(`Invite sent! ${inviteEmail} can now login with role: ${inviteRole}`);
      setInviteEmail('');
      setInviteRole('staff');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      toast.success('Role updated successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkFarmer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/farmers/link`,
        linkFormData,
        { withCredentials: true }
      );
      toast.success('Farmer linked to user successfully!');
      setLinkFormData({ user_id: '', farmer_id: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to link farmer');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/users/${userId}`, { withCredentials: true });
      toast.success('User removed successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (roleValue) => {
    return ROLES.find(r => r.value === roleValue) || ROLES[2];
  };

  return (
    <Layout user={user} activePage="users">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
            User Management
          </h1>
          <p className="text-slate-600 mt-1">Invite users and manage access levels</p>
        </div>

        {/* Role Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.value} className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-${role.color}-100`}>
                      <Icon className={`h-5 w-5 text-${role.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-slate-900">{role.label}</h3>
                      <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Invite New User */}
        <Card className="mb-8 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold flex items-center">
              <UserPlus className="mr-2" size={20} />
              Invite New User by Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2 mt-1">
                    <Mail className="absolute ml-3 mt-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      data-testid="invite-email-input"
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    User will login with this email via Google OAuth
                  </p>
                </div>

                <div>
                  <Label>Assign Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger data-testid="invite-role-select" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="send-invite-btn"
              >
                <UserPlus size={16} className="mr-2" />
                Grant Access
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Link Farmer to User */}
        <Card className="mb-8 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold flex items-center">
              <Tractor className="mr-2" size={20} />
              Link Farmer to User Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLinkFarmer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Select User Account</Label>
                  <Select
                    value={linkFormData.user_id}
                    onValueChange={(value) => setLinkFormData({ ...linkFormData, user_id: value })}
                  >
                    <SelectTrigger data-testid="link-user-select" className="mt-1">
                      <SelectValue placeholder="Choose user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.user_id} value={u.user_id}>
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Farmer Record</Label>
                  <Select
                    value={linkFormData.farmer_id}
                    onValueChange={(value) => setLinkFormData({ ...linkFormData, farmer_id: value })}
                  >
                    <SelectTrigger data-testid="link-farmer-select" className="mt-1">
                      <SelectValue placeholder="Choose farmer" />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((f) => (
                        <SelectItem key={f.farmer_id} value={f.farmer_id}>
                          {f.name} - {f.contact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !linkFormData.user_id || !linkFormData.farmer_id}
                className="bg-slate-900 hover:bg-slate-800 text-white"
                data-testid="link-farmer-btn"
              >
                Link Farmer to User
              </Button>
              <p className="text-sm text-slate-500">
                This will change the user's role to "farmer" and they'll see their farmer dashboard
              </p>
            </form>
          </CardContent>
        </Card>

        {/* All Users Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold flex items-center">
              <Users className="mr-2" size={20} />
              All Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Current Role</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Change Role</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const roleInfo = getRoleInfo(u.role);
                      const RoleIcon = roleInfo.icon;
                      
                      return (
                        <tr key={u.user_id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              {u.picture && (
                                <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full" />
                              )}
                              <span className="text-sm font-medium text-slate-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{u.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                u.role === 'owner'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : u.role === 'farmer'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <RoleIcon className="mr-1" size={12} />
                              {roleInfo.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={u.role}
                              onValueChange={(newRole) => handleRoleChange(u.user_id, newRole)}
                              disabled={loading || u.email === user.email}
                            >
                              <SelectTrigger className="w-36 mx-auto text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {u.email !== user.email && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(u.user_id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No users yet. Invite users to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default UserManagement;
