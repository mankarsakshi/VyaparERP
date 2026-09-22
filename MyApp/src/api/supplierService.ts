import {API_BASE_URL} from './config';

const BASE_URL = API_BASE_URL;

const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error: any) {
    if (
      error?.message?.includes('Network request failed') ||
      error?.message?.includes('Failed to fetch') ||
      error?.name === 'TypeError'
    ) {
      throw new Error(
        `Cannot connect to backend server at ${BASE_URL}. Ensure your backend server is running on port 8080.`,
      );
    }
    throw error;
  }
};

const parseResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const supplierAPI = {
  getSuppliers: async () => {
    const response = await safeFetch(`${BASE_URL}/api/suppliers`);
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || `Failed to fetch suppliers: ${response.status}`,
      );
    }
    let supplierData = [];
    if (Array.isArray(data)) supplierData = data;
    else if (Array.isArray(data?.suppliers)) supplierData = data.suppliers;
    else if (Array.isArray(data?.data)) supplierData = data.data;

    return supplierData.map((item: any) => ({
      id: String(item.id ?? ''),
      name: item.supplier_name ?? item.name ?? '',
      phone: item.phone ?? '',
      email: item.email ?? '',
      address: item.address ?? '',
      city: item.city ?? '',
      state: item.state ?? '',
      pincode: item.pincode ?? '',
      hasGstin: !!item.gstin,
      gstin: item.gstin ?? '',
      openingBalance: Number(item.opening_balance) || 0,
    }));
  },

  createSupplier: async (supplierData: any) => {
    const payload = {
      supplier_name: supplierData.name,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address,
      city: supplierData.city,
      state: supplierData.state,
      pincode: supplierData.pincode,
      gstin: supplierData.hasGstin ? supplierData.gstin : '',
      opening_balance: supplierData.openingBalance,
    };
    
    const response = await safeFetch(`${BASE_URL}/api/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to create supplier',
      );
    }
    return data;
  },

  updateSupplier: async (supplierData: any) => {
    const id = supplierData.id;
    if (!id) throw new Error('Supplier ID is required for update');
    
    const payload = {
      supplier_name: supplierData.name,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address,
      city: supplierData.city,
      state: supplierData.state,
      pincode: supplierData.pincode,
      gstin: supplierData.hasGstin ? supplierData.gstin : '',
      opening_balance: supplierData.openingBalance,
    };

    const response = await safeFetch(`${BASE_URL}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to update supplier',
      );
    }
    return data;
  },

  deleteSupplier: async (id: number | string) => {
    if (!id) throw new Error('Supplier ID is required for delete');
    const response = await safeFetch(`${BASE_URL}/api/suppliers/${id}`, {
      method: 'DELETE',
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to delete supplier',
      );
    }
    return data;
  },
};

export default supplierAPI;
