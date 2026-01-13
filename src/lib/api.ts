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
