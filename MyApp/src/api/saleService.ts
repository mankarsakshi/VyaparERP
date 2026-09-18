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

export const saleAPI = {
  getSales: async () => {
    const response = await safeFetch(`${BASE_URL}/api/sales`);
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || `Failed to fetch sales: ${response.status}`,
      );
    }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.sales)) return data.sales;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.sales)) return data.data.sales;
    return [];
  },

  getSaleById: async (id: number | string) => {
    if (id === undefined || id === null || id === '') {
      throw new Error('Sale ID is required');
    }
    const response = await safeFetch(`${BASE_URL}/api/sales/${id}`);
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || `Failed to fetch sale: ${response.status}`,
      );
    }
    let saleObj = data?.sale || data?.data?.sale || data?.data || data;
    const itemsList =
      data?.items ||
      data?.sale_items ||
      data?.products ||
      data?.data?.items ||
      data?.data?.sale_items ||
      data?.data?.products ||
      saleObj?.items ||
      saleObj?.sale_items ||
      saleObj?.products;

    if (saleObj && typeof saleObj === 'object' && !Array.isArray(saleObj)) {
      if (Array.isArray(itemsList)) {
        saleObj = {
          ...saleObj,
          items: itemsList,
          sale_items: itemsList,
        };
      }
    }
    return saleObj;
  },

  createSale: async (saleData: any) => {
    const response = await safeFetch(`${BASE_URL}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(saleData),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to create sale',
      );
    }
    return data;
  },

  updateSale: async (saleData: any) => {
    const id = saleData?.id || saleData?.sale_id;
    if (!id) throw new Error('Sale ID is required for update');
    const {id: _id, sale_id: _saleId, ...updateData} = saleData;
    const response = await safeFetch(`${BASE_URL}/api/sales/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id: Number(id),
        sale_id: Number(id),
        ...updateData,
      }),
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to update sale',
      );
    }
    return data;
  },

  deleteSale: async (id: number | string) => {
    if (!id) throw new Error('Sale ID is required for delete');
    const response = await safeFetch(`${BASE_URL}/api/sales/${id}`, {
      method: 'DELETE',
    });
    const data = await parseResponse(response);
    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message || data?.error || 'Failed to delete sale',
      );
    }
    return data;
  },
};

export default saleAPI;
