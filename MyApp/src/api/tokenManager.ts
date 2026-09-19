declare const global: any;
import RNFS from 'react-native-fs';

let authToken: string | null = null;
const TOKEN_FILE_PATH = `${RNFS.DocumentDirectoryPath}/auth_token.txt`;

export const loadToken = async () => {
  try {
    const exists = await RNFS.exists(TOKEN_FILE_PATH);
    if (exists) {
      const token = await RNFS.readFile(TOKEN_FILE_PATH, 'utf8');
      if (token) {
        authToken = token;
        return token;
      }
    }
  } catch (err) {
    console.log('Error reading token', err);
  }
  return null;
};

export const setAuthToken = async (token: string | null) => {
  authToken = token;
  try {
    if (token) {
      await RNFS.writeFile(TOKEN_FILE_PATH, token, 'utf8');
    } else {
      const exists = await RNFS.exists(TOKEN_FILE_PATH);
      if (exists) {
        await RNFS.unlink(TOKEN_FILE_PATH);
      }
    }
  } catch (err) {
    console.log('Error saving token', err);
  }
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
