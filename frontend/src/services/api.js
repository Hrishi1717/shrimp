import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  createSession: async (sessionId) => {
    const response = await api.post('/auth/session', { session_id: sessionId });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export const farmerAPI = {
  createFarmer: async (data) => {
    const response = await api.post('/farmers', data);
    return response.data;
  },

  getFarmers: async () => {
    const response = await api.get('/farmers');
    return response.data;
  },

  getFarmerStats: async () => {
    const response = await api.get('/farmers/me/stats');
    return response.data;
  },
};

export const batchAPI = {
  createBatch: async (data) => {
    const response = await api.post('/batches', data);
    return response.data;
  },

  getBatches: async () => {
    const response = await api.get('/batches');
    return response.data;
  },

  getBatch: async (batchId) => {
    const response = await api.get(`/batches/${batchId}`);
    return response.data;
  },
};

export const processingAPI = {
  createStage: async (data) => {
    const response = await api.post('/processing', data);
    return response.data;
  },

  getStagesByBatch: async (batchId) => {
    const response = await api.get(`/processing/batch/${batchId}`);
    return response.data;
  },
};

export const inventoryAPI = {
  createInventory: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  getInventory: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
};

export const dispatchAPI = {
  createDispatch: async (data) => {
    const response = await api.post('/dispatch', data);
    return response.data;
  },

  getDispatches: async () => {
    const response = await api.get('/dispatch');
    return response.data;
  },
};

export const paymentAPI = {
  createPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  updatePaymentStatus: async (paymentId, status) => {
    const response = await api.put(`/payments/${paymentId}/status?status=${status}`);
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
};

export const dashboardAPI = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
};

export const exportAPI = {
  exportBatches: async () => {
    const response = await api.post('/export/batches', {}, {
      responseType: 'arraybuffer',
    });
    
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batches_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  exportPayments: async () => {
    const response = await api.post('/export/payments', {}, {
      responseType: 'arraybuffer',
    });
    
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  exportProcessing: async () => {
    const response = await api.post('/export/processing', {}, {
      responseType: 'arraybuffer',
    });
    
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processing_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default api;
