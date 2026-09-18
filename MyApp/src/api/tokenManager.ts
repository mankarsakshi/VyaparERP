declare const global: any;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const globalObj = typeof globalThis !== 'undefined' ? globalThis : (typeof global !== 'undefined' ? global : {} as any);
const originalFetch = (globalObj as any).fetch;

(globalObj as any).fetch = async (input: RequestInfo | URL | any, init?: RequestInit | any) => {
  const urlStr = typeof input === 'string' ? input : input.toString();
  const isApiRequest = urlStr.includes(':8080') || urlStr.includes('/api/') || urlStr.includes('/login') || urlStr.includes('/signup');

  if (isApiRequest && authToken) {
    init = init || {};
    init.headers = {
      ...init.headers,
      Authorization: 'Bearer ' + authToken,
    };
  }

  return originalFetch(input, init);
};

