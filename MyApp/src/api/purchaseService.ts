// import {API_BASE_URL} from './config';

// const BASE_URL = API_BASE_URL;

// /**
//  * Helper to wrap network requests and provide friendly diagnostics on failure
//  */
// const safeFetch = async (url: string, options?: RequestInit) => {
//   try {
//     const response = await fetch(url, options);
//     return response;
//   } catch (error: any) {
//     if (
//       error?.message?.includes('Network request failed') ||
//       error?.message?.includes('Failed to fetch') ||
//       error?.name === 'TypeError'
//     ) {
//       throw new Error(
//         `Cannot connect to backend server at ${BASE_URL}. Ensure your backend server is running on port 8080 (e.g., in Demo/vyapar-backend run 'npm start').`,
//       );
//     }
//     throw error;
//   }
// };

// export const purchaseAPI = {
//   // ==========================================
//   // GET ALL PURCHASES
//   // ==========================================
//   getPurchases: async () => {
//     const response = await safeFetch(`${BASE_URL}/api/purchases`);

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data?.message ||
//           `Failed to fetch purchases: ${response.status}`,
//       );
//     }

//     if (Array.isArray(data)) {
//       return data;
//     }

//     if (Array.isArray(data?.purchases)) {
//       return data.purchases;
//     }

//     if (Array.isArray(data?.data)) {
//       return data.data;
//     }

//     return [];
//   },

//   // ==========================================
//   // GET PURCHASE BY ID
//   // ==========================================
//   getPurchaseById: async (
//     id: number | string,
//   ) => {
//     if (!id) {
//       throw new Error(
//         'Purchase ID is required',
//       );
//     }

//     const response = await safeFetch(`${BASE_URL}/api/purchases/${id}`);

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data?.message ||
//           `Failed to fetch purchase: ${response.status}`,
//       );
//     }

//     /*
//      * Normalize purchase object and attach items if separated
//      */
//     let purchaseObj = data?.purchase || data?.data?.purchase || data?.data || data;

//     const itemsList =
//       data?.items ||
//       data?.purchase_items ||
//       data?.products ||
//       data?.data?.items ||
//       data?.data?.purchase_items ||
//       purchaseObj?.items ||
//       purchaseObj?.purchase_items ||
//       purchaseObj?.products;

//     if (purchaseObj && typeof purchaseObj === 'object' && !Array.isArray(purchaseObj)) {
//       if (itemsList && !purchaseObj.items) {
//         purchaseObj = {
//           ...purchaseObj,
//           items: itemsList,
//           purchase_items: itemsList,
//         };
//       }
//     }

//     return purchaseObj;
//   },

//   // ==========================================
//   // CREATE PURCHASE
//   // ==========================================
//   createPurchase: async (
//     purchaseData: any,
//   ) => {
//     console.log(
//       'CREATE PURCHASE:',
//       JSON.stringify(
//         purchaseData,
//         null,
//         2,
//       ),
//     );

//     const response = await safeFetch(
//       `${BASE_URL}/api/purchases`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(
//           purchaseData,
//         ),
//       },
//     );

//     const data = await response.json();

//     console.log(
//       'CREATE PURCHASE RESPONSE:',
//       JSON.stringify(
//         data,
//         null,
//         2,
//       ),
//     );

//     if (!response.ok) {
//       throw new Error(
//         data?.message ||
//           'Failed to create purchase',
//       );
//     }

//     return data;
//   },

//   // ==========================================
//   // UPDATE PURCHASE
//   // ==========================================
//   updatePurchase: async (
//     purchaseData: any,
//   ) => {
//     const id =
//       purchaseData?.id ||
//       purchaseData?.purchase_id;

//     if (!id) {
//       throw new Error(
//         'Purchase ID is required for update',
//       );
//     }

//     const {
//       id: _id,
//       purchase_id: _purchaseId,
//       ...updateData
//     } = purchaseData;

//     console.log(
//       'UPDATE PURCHASE ID:',
//       id,
//     );

//     console.log(
//       'UPDATE PURCHASE DATA:',
//       JSON.stringify(
//         updateData,
//         null,
//         2,
//       ),
//     );

//     const response = await safeFetch(
//       `${BASE_URL}/api/purchases/${id}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify({
//           id: Number(id),
//           purchase_id: Number(id),
//           ...updateData,
//         }),
//       },
//     );

//     const data = await response.json();

//     console.log(
//       'UPDATE PURCHASE RESPONSE:',
//       JSON.stringify(
//         data,
//         null,
//         2,
//       ),
//     );

//     if (!response.ok) {
//       throw new Error(
//         data?.message ||
//           'Failed to update purchase',
//       );
//     }

//     return data;
//   },

//   // ==========================================
//   // DELETE PURCHASE
//   // ==========================================
//   deletePurchase: async (
//     id: number | string,
//   ) => {
//     if (!id) {
//       throw new Error(
//         'Purchase ID is required for delete',
//       );
//     }

//     console.log(
//       'DELETE PURCHASE ID:',
//       id,
//     );

//     const response = await safeFetch(
//       `${BASE_URL}/api/purchases/${id}`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     const data = await response.json();

//     console.log(
//       'DELETE PURCHASE RESPONSE:',
//       JSON.stringify(
//         data,
//         null,
//         2,
//       ),
//     );

//     if (!response.ok) {
//       throw new Error(
//         data?.message ||
//           'Failed to delete purchase',
//       );
//     }

//     return data;
//   },
// };

// export default purchaseAPI;


import {API_BASE_URL} from './config';

const BASE_URL = API_BASE_URL;

/**
 * Helper to handle network requests
 */
const safeFetch = async (
  url: string,
  options?: RequestInit,
) => {
  try {
    const response = await fetch(
      url,
      options,
    );

    return response;
  } catch (error: any) {
    console.log(
      'NETWORK ERROR:',
      error,
    );

    if (
      error?.message?.includes(
        'Network request failed',
      ) ||
      error?.message?.includes(
        'Failed to fetch',
      ) ||
      error?.name === 'TypeError'
    ) {
      throw new Error(
        `Cannot connect to backend server at ${BASE_URL}. Ensure your backend server is running on port 8080.`,
      );
    }

    throw error;
  }
};

/**
 * Safely parse JSON response
 */
const parseResponse = async (
  response: Response,
) => {
  const text =
    await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const purchaseAPI = {
  // =========================================================
  // GET ALL PURCHASES
  // =========================================================

  getPurchases: async () => {
    const response =
      await safeFetch(
        `${BASE_URL}/api/purchases`,
      );

    const data =
      await parseResponse(
        response,
      );

    console.log(
      'GET ALL PURCHASES RESPONSE:',
      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message ||
              data?.error ||
              `Failed to fetch purchases: ${response.status}`,
      );
    }

    // Backend returns array
    if (Array.isArray(data)) {
      return data;
    }

    // Backend returns { purchases: [] }
    if (
      Array.isArray(
        data?.purchases,
      )
    ) {
      return data.purchases;
    }

    // Backend returns { data: [] }
    if (
      Array.isArray(
        data?.data,
      )
    ) {
      return data.data;
    }

    // Backend returns { data: { purchases: [] } }
    if (
      Array.isArray(
        data?.data?.purchases,
      )
    ) {
      return data.data.purchases;
    }

    return [];
  },

  // =========================================================
  // GET PURCHASE BY ID
  // USED BY ViewPurchase.tsx
  // =========================================================

  getPurchaseById: async (
    id: number | string,
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ''
    ) {
      throw new Error(
        'Purchase ID is required',
      );
    }

    console.log(
      'GET PURCHASE BY ID:',
      id,
    );

    const response =
      await safeFetch(
        `${BASE_URL}/api/purchases/${id}`,
      );

    const data =
      await parseResponse(
        response,
      );

    console.log(
      'GET PURCHASE BY ID RESPONSE:',
      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message ||
              data?.error ||
              `Failed to fetch purchase: ${response.status}`,
      );
    }

    /*
     * Possible backend responses:
     *
     * {
     *   purchase: {...},
     *   items: [...]
     * }
     *
     * OR
     *
     * {
     *   data: {
     *     purchase: {...},
     *     items: [...]
     *   }
     * }
     *
     * OR
     *
     * {
     *   id: 1,
     *   supplier_name: "...",
     *   items: [...]
     * }
     */

    let purchaseObj =
      data?.purchase ||
      data?.data?.purchase ||
      data?.data ||
      data;

    /*
     * Find product items from all possible
     * backend response structures.
     */

    const itemsList =
      data?.items ||
      data?.purchase_items ||
      data?.products ||
      data?.data?.items ||
      data?.data?.purchase_items ||
      data?.data?.products ||
      purchaseObj?.items ||
      purchaseObj?.purchase_items ||
      purchaseObj?.products;

    /*
     * Make sure purchase object is actually
     * an object and not an array.
     */

    if (
      purchaseObj &&
      typeof purchaseObj ===
        'object' &&
      !Array.isArray(
        purchaseObj,
      )
    ) {
      /*
       * Attach items to purchase object.
       */

      if (
        Array.isArray(
          itemsList,
        )
      ) {
        purchaseObj = {
          ...purchaseObj,
          items: itemsList,
          purchase_items:
            itemsList,
        };
      }

      /*
       * If items are JSON string,
       * convert them into an array.
       */

      if (
        typeof purchaseObj.items ===
        'string'
      ) {
        try {
          const parsedItems =
            JSON.parse(
              purchaseObj.items,
            );

          if (
            Array.isArray(
              parsedItems,
            )
          ) {
            purchaseObj = {
              ...purchaseObj,
              items: parsedItems,
              purchase_items:
                parsedItems,
            };
          }
        } catch {
          console.log(
            'Unable to parse purchase items JSON',
          );
        }
      }

      /*
       * If purchase_items is a JSON string.
       */

      if (
        typeof purchaseObj.purchase_items ===
        'string'
      ) {
        try {
          const parsedItems =
            JSON.parse(
              purchaseObj.purchase_items,
            );

          if (
            Array.isArray(
              parsedItems,
            )
          ) {
            purchaseObj = {
              ...purchaseObj,
              items: parsedItems,
              purchase_items:
                parsedItems,
            };
          }
        } catch {
          console.log(
            'Unable to parse purchase_items JSON',
          );
        }
      }
    }

    return purchaseObj;
  },

  // =========================================================
  // CREATE PURCHASE
  // =========================================================

  createPurchase: async (
    purchaseData: any,
  ) => {
    console.log(
      'CREATE PURCHASE DATA:',
      JSON.stringify(
        purchaseData,
        null,
        2,
      ),
    );

    const response =
      await safeFetch(
        `${BASE_URL}/api/purchases`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body: JSON.stringify(
            purchaseData,
          ),
        },
      );

    const data =
      await parseResponse(
        response,
      );

    console.log(
      'CREATE PURCHASE RESPONSE:',
      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message ||
              data?.error ||
              'Failed to create purchase',
      );
    }

    return data;
  },

  // =========================================================
  // UPDATE PURCHASE
  // USED BY AddPurchase EDIT MODE
  // =========================================================

  updatePurchase: async (
    purchaseData: any,
  ) => {
    const id =
      purchaseData?.id ||
      purchaseData?.purchase_id;

    if (
      id === undefined ||
      id === null ||
      id === ''
    ) {
      throw new Error(
        'Purchase ID is required for update',
      );
    }

    const {
      id: _id,
      purchase_id: _purchaseId,
      ...updateData
    } = purchaseData;

    console.log(
      'UPDATE PURCHASE ID:',
      id,
    );

    console.log(
      'UPDATE PURCHASE DATA:',
      JSON.stringify(
        updateData,
        null,
        2,
      ),
    );

    const response =
      await safeFetch(
        `${BASE_URL}/api/purchases/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body: JSON.stringify({
            id: Number(id),

            purchase_id:
              Number(id),

            ...updateData,
          }),
        },
      );

    const data =
      await parseResponse(
        response,
      );

    console.log(
      'UPDATE PURCHASE RESPONSE:',
      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message ||
              data?.error ||
              'Failed to update purchase',
      );
    }

    return data;
  },

  // =========================================================
  // DELETE PURCHASE
  // USED BY ALL PURCHASES
  // =========================================================

  deletePurchase: async (
    id: number | string,
  ) => {
    if (
      id === undefined ||
      id === null ||
      id === ''
    ) {
      throw new Error(
        'Purchase ID is required for delete',
      );
    }

    console.log(
      'DELETE PURCHASE ID:',
      id,
    );

    const response =
      await safeFetch(
        `${BASE_URL}/api/purchases/${id}`,
        {
          method: 'DELETE',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },
        },
      );

    const data =
      await parseResponse(
        response,
      );

    console.log(
      'DELETE PURCHASE RESPONSE:',
      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    if (!response.ok) {
      throw new Error(
        typeof data === 'string'
          ? data
          : data?.message ||
              data?.error ||
              'Failed to delete purchase',
      );
    }

    return data;
  },
};

export default purchaseAPI;