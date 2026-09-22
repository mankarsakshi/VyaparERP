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

export const customerAPI = {
  getCustomers: async () => {
    const response = await safeFetch(`${BASE_URL}/api/customers`);
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || `Failed to fetch customers: ${response.status}`,
      );
    }
    let customerData = [];
    if (Array.isArray(data)) customerData = data;
    else if (Array.isArray(data?.customers)) customerData = data.customers;
    else if (Array.isArray(data?.data)) customerData = data.data;

    return customerData.map((item: any) => ({
      id: String(item.id ?? ''),
      name: item.customer_name ?? item.name ?? '',
      phone: item.phone ?? '',
      email: item.email ?? '',
      address: item.address ?? '',
      city: item.city ?? '',
      state: item.state ?? '',
      pincode: item.pincode ?? '',
      hasGstin: !!item.gstin,
      gstin: item.gstin ?? '',
      openingBalance: Number(item.opening_balance) || 0,
      bankName: item.bank_name ?? item.bankName ?? '',
      accountNumber: item.account_number ?? item.accountNumber ?? '',
      ifscCode: item.ifsc_code ?? item.ifscCode ?? '',
    }));
  },

  createCustomer: async (customerData: any) => {
    const payload = {
      customer_name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      pincode: customerData.pincode,
      gstin: customerData.hasGstin ? customerData.gstin : '',
      opening_balance: customerData.openingBalance,
      bank_name: customerData.bankName,
      account_number: customerData.accountNumber,
      ifsc_code: customerData.ifscCode,
    };
    
    const response = await safeFetch(`${BASE_URL}/api/customers`, {
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
          : data?.message || data?.error || 'Failed to create customer',
      );
    }
    return data;
  },

  updateCustomer: async (customerData: any) => {
    const id = customerData.id;
    if (!id) throw new Error('Customer ID is required for update');
    
    const payload = {
      customer_name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      pincode: customerData.pincode,
      gstin: customerData.hasGstin ? customerData.gstin : '',
      opening_balance: customerData.openingBalance,
      bank_name: customerData.bankName,
      account_number: customerData.accountNumber,
      ifsc_code: customerData.ifscCode,
    };

    const response = await safeFetch(`${BASE_URL}/api/customers/${id}`, {
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
          : data?.message || data?.error || 'Failed to update customer',
      );
    }
    return data;
  },

  deleteCustomer: async (id: number | string) => {
    if (!id) throw new Error('Customer ID is required for delete');
    const response = await safeFetch(`${BASE_URL}/api/customers/${id}`, {
      method: 'DELETE',
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to delete customer',
      );
    }
    return data;
  },
};

export default customerAPI;
