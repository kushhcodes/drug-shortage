const BASE_URL = 'http://127.0.0.1:8000';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem('refresh_token', token);
};

const handleUnauthorized = (): void => {
  removeAuthToken();
  window.location.href = '/login';
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// Auth APIs
export const login = async (email: string, password: string) => {
  const response = await apiRequest<{ access: string; refresh: string }>(
    '/api/auth/login/',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
  setAuthToken(response.access);
  setRefreshToken(response.refresh);
  return response;
};

export const register = async (data: any) => {
  const response = await apiRequest<{ user: any; tokens: { access: string; refresh: string } }>(
    '/api/auth/register/',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  // Auto login behavior
  if (response.tokens) {
    setAuthToken(response.tokens.access);
    setRefreshToken(response.tokens.refresh);
  }
  return response;
};

export const logout = async () => {
  await apiRequest('/api/auth/logout/', { method: 'POST' });
  removeAuthToken();
};

export const getProfile = () => apiRequest<{
  id: number;
  email: string;
  name: string;
  role: string;
}>('/api/auth/profile/');

// Hospital APIs
export const getHospitals = () => apiRequest<Array<{
  id: number;
  name: string;
  location: string;
  capacity: number;
}>>('/api/hospitals/');

export const getHospitalInventory = (hospitalId: number) =>
  apiRequest<Array<{
    id: number;
    medicine_name: string;
    quantity: number;
    unit: string;
    expiry_date: string;
  }>>(`/api/hospitals/${hospitalId}/inventory/`);

export const getLowStock = (hospitalId: number) =>
  apiRequest<Array<{
    id: number;
    medicine_name: string;
    quantity: number;
    threshold: number;
    status: string;
  }>>(`/api/hospitals/${hospitalId}/low_stock/`);

// Medicine APIs
export const getMedicines = () => apiRequest<Array<{
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  is_essential: boolean;
}>>('/api/medicines/');

export const getEssentialMedicines = () =>
  apiRequest<Array<{
    id: number;
    name: string;
    category: string;
  }>>('/api/medicines/essential/');

export const getMedicinesByCategory = (category: string) =>
  apiRequest<Array<{
    id: number;
    name: string;
    category: string;
  }>>(`/api/medicines/by_category/?category=${category}`);

// Predictions API
export const getPredictions = () => apiRequest<Array<{
  id: number;
  medicine_name: string;
  hospital_name: string;
  predicted_shortage_date: string;
  confidence: number;
  risk_level: string;
}>>('/api/predictions/');

// ============================================
// ADMIN CRUD APIs
// ============================================

// Types
export interface Hospital {
  id: number;
  name: string;
  registration_number?: string;
  hospital_type: string;
  bed_capacity: number;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Medicine {
  id: number;
  name: string;
  generic_name?: string;
  category: string;
  strength?: string;
  manufacturer?: string;
  is_essential: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface Inventory {
  id: number;
  hospital: number;
  hospital_name?: string;
  medicine: number;
  medicine_name?: string;
  current_stock: number;
  reorder_level: number;
  max_capacity?: number;
  average_daily_usage?: number;
  last_updated?: string;
  stock_status?: string;
}

export interface Alert {
  id: number;
  hospital: number;
  hospital_name?: string;
  medicine: number;
  medicine_name?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  current_stock: number;
  predicted_stockout_date?: string;
  message?: string;
  created_at?: string;
}

// Hospital CRUD
export const getHospitalsAdmin = () =>
  apiRequest<Hospital[]>('/api/hospitals/');

export const getHospital = (id: number) =>
  apiRequest<Hospital>(`/api/hospitals/${id}/`);

export const createHospital = (data: Partial<Hospital>) =>
  apiRequest<Hospital>('/api/hospitals/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateHospital = (id: number, data: Partial<Hospital>) =>
  apiRequest<Hospital>(`/api/hospitals/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteHospital = (id: number) =>
  apiRequest<void>(`/api/hospitals/${id}/`, {
    method: 'DELETE',
  });

// Medicine CRUD
export const getMedicinesAdmin = () =>
  apiRequest<Medicine[]>('/api/medicines/');

export const getMedicine = (id: number) =>
  apiRequest<Medicine>(`/api/medicines/${id}/`);

export const createMedicine = (data: Partial<Medicine>) =>
  apiRequest<Medicine>('/api/medicines/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateMedicine = (id: number, data: Partial<Medicine>) =>
  apiRequest<Medicine>(`/api/medicines/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteMedicine = (id: number) =>
  apiRequest<void>(`/api/medicines/${id}/`, {
    method: 'DELETE',
  });

// Inventory CRUD
export const getInventoryAdmin = () =>
  apiRequest<Inventory[]>('/api/hospitals/inventory/');

export const getInventoryItem = (id: number) =>
  apiRequest<Inventory>(`/api/hospitals/inventory/${id}/`);

export const createInventory = (data: Partial<Inventory>) =>
  apiRequest<Inventory>('/api/hospitals/inventory/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateInventory = (id: number, data: Partial<Inventory>) =>
  apiRequest<Inventory>(`/api/hospitals/inventory/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteInventory = (id: number) =>
  apiRequest<void>(`/api/hospitals/inventory/${id}/`, {
    method: 'DELETE',
  });

export const getLowStockAll = () =>
  apiRequest<Inventory[]>('/api/hospitals/inventory/low_stock/');

export const getOutOfStock = () =>
  apiRequest<Inventory[]>('/api/hospitals/inventory/out_of_stock/');

// Alerts CRUD
export const getAlerts = () =>
  apiRequest<Alert[]>('/api/alerts/');

export const getAlert = (id: number) =>
  apiRequest<Alert>(`/api/alerts/${id}/`);

export const updateAlert = (id: number, data: Partial<Alert>) =>
  apiRequest<Alert>(`/api/alerts/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const resolveAlert = (id: number) =>
  apiRequest<Alert>(`/api/alerts/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'RESOLVED' }),
  });

export const acknowledgeAlert = (id: number) =>
  apiRequest<Alert>(`/api/alerts/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'ACKNOWLEDGED' }),
  });

