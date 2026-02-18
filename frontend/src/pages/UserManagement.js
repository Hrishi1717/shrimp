import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, UserCog, Link as LinkIcon } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

function UserManagement({ user }) {
  const [users, setUsers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <Layout user={user} activePage="users">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
            User Management
          </h1>
          <p className="text-slate-600 mt-1">Manage user roles and farmer assignments</p>
        </div>

        {/* Link Farmer to User */}
        <Card className="mb-8 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold flex items-center">
              <LinkIcon className="mr-2" size={20} />
              Link Farmer to User Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLinkFarmer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Select User</Label>
                  <Select
                    value={linkFormData.user_id}
                    onValueChange={(value) => setLinkFormData({ ...linkFormData, user_id: value })}
                  >
                    <SelectTrigger data-testid="user-select" className="mt-1">
                      <SelectValue placeholder="Select user" />
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
                  <Label>Select Farmer</Label>
                  <Select
                    value={linkFormData.farmer_id}
                    onValueChange={(value) => setLinkFormData({ ...linkFormData, farmer_id: value })}
                  >
                    <SelectTrigger data-testid="farmer-select" className="mt-1">
                      <SelectValue placeholder="Select farmer" />
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
                className="bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="link-farmer-btn"
              >
                Link Farmer to User
              </Button>
              <p className="text-sm text-slate-500">
                This will change the user's role to "farmer" and link them to the farmer record.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-semibold flex items-center">
              <Users className="mr-2" size={20} />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Current Role</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Change Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-900 font-medium">{u.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{u.email}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`status-badge ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : u.role === 'farmer'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={u.role}
                            onValueChange={(newRole) => handleRoleChange(u.user_id, newRole)}
                            disabled={loading}
                          >
                            <SelectTrigger className="w-32 mx-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="farmer">Farmer</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <UserCog className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No users yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default UserManagement;
