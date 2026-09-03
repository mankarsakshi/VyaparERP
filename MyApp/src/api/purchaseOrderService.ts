import {API_BASE_URL} from './config';

const BASE_URL = API_BASE_URL;

const getErrorMessage = (
  data: any,
  fallback: string,
) => {
  if (typeof data === 'string') {
    return data;
  }

  return (
    data?.message ||
    data?.error ||
    data?.errors?.message ||
    fallback
  );
};

const parseResponse = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    return await fetch(url, options);
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

export const purchaseOrderAPI = {
  // =====================================================
  // GET ALL PURCHASE ORDERS
  // =====================================================
  getPurchaseOrders: async () => {
    try {
      const response = await safeFetch(
        `${BASE_URL}/api/purchase-orders`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const data = await parseResponse(response);

      console.log(
        'GET ALL PURCHASE ORDERS STATUS:',
        response.status,
      );

      console.log(
        'GET ALL PURCHASE ORDERS RESPONSE:',
        JSON.stringify(data, null, 2),
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            `Failed to fetch purchase orders: ${response.status}`,
          ),
        );
      }

      /*
       * Support different backend response formats:
       *
       * [
       *   {...}
       * ]
       *
       * {
       *   data: [...]
       * }
       *
       * {
       *   orders: [...]
       * }
       */
      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.orders)) {
        return data.orders;
      }

      if (Array.isArray(data?.purchaseOrders)) {
        return data.purchaseOrders;
      }

      return [];
    } catch (error) {
      console.error(
        'GET PURCHASE ORDERS ERROR:',
        error,
      );

      throw error;
    }
  },

  // =====================================================
  // GET PURCHASE ORDER BY ID
  // =====================================================
  getPurchaseOrderById: async (
    id: number | string,
  ) => {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ''
    ) {
      throw new Error(
        'Purchase Order ID is required',
      );
    }

    const purchaseOrderId = String(id);

    console.log(
      '====================================',
    );

    console.log(
      'GET PURCHASE ORDER BY ID:',
      purchaseOrderId,
    );

    console.log(
      'GET URL:',
      `${BASE_URL}/api/purchase-orders/${purchaseOrderId}`,
    );

    console.log(
      '====================================',
    );

    try {
      const response = await safeFetch(
        `${BASE_URL}/api/purchase-orders/${purchaseOrderId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const data = await parseResponse(response);

      console.log(
        'GET PURCHASE ORDER STATUS:',
        response.status,
      );

      console.log(
        'GET PURCHASE ORDER RESPONSE:',
        JSON.stringify(data, null, 2),
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            `Failed to fetch purchase order: ${response.status}`,
          ),
        );
      }

      /*
       * IMPORTANT:
       * Normalize the database record and ensure items array is attached
       */
      let orderObj =
        data?.purchaseOrder ||
        data?.order ||
        data?.data?.purchaseOrder ||
        data?.data?.order ||
        data?.data ||
        data;

      const itemsList =
        data?.items ||
        data?.purchase_order_items ||
        data?.order_items ||
        data?.products ||
        data?.data?.items ||
        data?.data?.purchase_order_items ||
        data?.data?.order_items ||
        orderObj?.items ||
        orderObj?.purchase_order_items ||
        orderObj?.order_items ||
        orderObj?.products;

      if (orderObj && typeof orderObj === 'object' && !Array.isArray(orderObj)) {
        if (itemsList && !orderObj.items) {
          orderObj = {
            ...orderObj,
            items: itemsList,
            purchase_order_items: itemsList,
          };
        }
      }

      return orderObj;
    } catch (error) {
      console.error(
        'GET PURCHASE ORDER BY ID ERROR:',
        error,
      );

      throw error;
    }
  },

  // =====================================================
  // CREATE PURCHASE ORDER
  // =====================================================
  createPurchaseOrder: async (
    purchaseOrderData: any,
  ) => {
    console.log(
      '====================================',
    );

    console.log(
      'CREATE PURCHASE ORDER REQUEST:',
      JSON.stringify(
        purchaseOrderData,
        null,
        2,
      ),
    );

    console.log(
      'CREATE URL:',
      `${BASE_URL}/api/purchase-orders`,
    );

    console.log(
      '====================================',
    );

    try {
      const response = await safeFetch(
        `${BASE_URL}/api/purchase-orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(
            purchaseOrderData,
          ),
        },
      );

      const data = await parseResponse(response);

      console.log(
        'CREATE PURCHASE ORDER STATUS:',
        response.status,
      );

      console.log(
        'CREATE PURCHASE ORDER RESPONSE:',
        JSON.stringify(data, null, 2),
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            'Failed to create purchase order',
          ),
        );
      }

      return data;
    } catch (error) {
      console.error(
        'CREATE PURCHASE ORDER ERROR:',
        error,
      );

      throw error;
    }
  },

  // =====================================================
  // UPDATE PURCHASE ORDER
  // =====================================================
  updatePurchaseOrder: async (
    id: number | string,
    purchaseOrderData: any,
  ) => {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ''
    ) {
      throw new Error(
        'Purchase Order ID is required for update',
      );
    }

    const purchaseOrderId = String(id);

    /*
     * Remove ID fields from body.
     * ID should come from URL.
     */
    const {
      id: _id,
      purchase_order_id: _purchaseOrderId,
      purchaseOrderId: _purchaseOrderIdCamel,
      ...updateData
    } = purchaseOrderData || {};

    console.log(
      '====================================',
    );

    console.log(
      'UPDATE PURCHASE ORDER ID:',
      purchaseOrderId,
    );

    console.log(
      'UPDATE URL:',
      `${BASE_URL}/api/purchase-orders/${purchaseOrderId}`,
    );

    console.log(
      'UPDATE DATA:',
      JSON.stringify(updateData, null, 2),
    );

    console.log(
      '====================================',
    );

    try {
      const response = await safeFetch(
        `${BASE_URL}/api/purchase-orders/${purchaseOrderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await parseResponse(response);

      console.log(
        'UPDATE PURCHASE ORDER STATUS:',
        response.status,
      );

      console.log(
        'UPDATE PURCHASE ORDER RESPONSE:',
        JSON.stringify(data, null, 2),
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            'Failed to update purchase order',
          ),
        );
      }

      return data;
    } catch (error) {
      console.error(
        'UPDATE PURCHASE ORDER ERROR:',
        error,
      );

      throw error;
    }
  },

  // =====================================================
  // DELETE PURCHASE ORDER
  // =====================================================
  deletePurchaseOrder: async (
    id: number | string,
  ) => {
    if (
      id === undefined ||
      id === null ||
      String(id).trim() === ''
    ) {
      throw new Error(
        'Purchase Order ID is required for delete',
      );
    }

    const purchaseOrderId = String(id);

    console.log(
      '====================================',
    );

    console.log(
      'DELETE PURCHASE ORDER ID:',
      purchaseOrderId,
    );

    console.log(
      'DELETE URL:',
      `${BASE_URL}/api/purchase-orders/${purchaseOrderId}`,
    );

    console.log(
      '====================================',
    );

    try {
      const response = await safeFetch(
        `${BASE_URL}/api/purchase-orders/${purchaseOrderId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const data = await parseResponse(response);

      console.log(
        'DELETE PURCHASE ORDER STATUS:',
        response.status,
      );

      console.log(
        'DELETE PURCHASE ORDER RESPONSE:',
        JSON.stringify(data, null, 2),
      );

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            data,
            'Failed to delete purchase order',
          ),
        );
      }

      return data;
    } catch (error) {
      console.error(
        'DELETE PURCHASE ORDER ERROR:',
        error,
      );

      throw error;
    }
  },
};

export default purchaseOrderAPI;