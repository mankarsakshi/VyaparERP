import {Platform} from 'react-native';
import {API_BASE_URL} from './config';

export interface SignupPayload {
  businessName: string;
  email: string;
  password: string;
  subscriptionPlan?: string;
  phone?: string;
  address?: string;
  gstin?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Timeout per fetch attempt in milliseconds */
const FETCH_TIMEOUT_MS = 10000;

/**
 * Candidate URLs for backend API connection.
 * The primary URL (from config) is always first; duplicates are skipped.
 */
const getCandidateUrls = (path: string): string[] => {
  const candidates = [`${API_BASE_URL}${path}`];

  if (Platform.OS === 'android') {
    // Wi-Fi (physical device) first, then emulator loopback, then localhost
    const wifiUrl = `http://10.85.57.27:8080${path}`;
    const emulatorUrl = `http://10.0.2.2:8080${path}`;
    const localUrl = `http://localhost:8080${path}`;

    if (!candidates.includes(wifiUrl)) candidates.push(wifiUrl);
    if (!candidates.includes(emulatorUrl)) candidates.push(emulatorUrl);
    if (!candidates.includes(localUrl)) candidates.push(localUrl);
  }

  return candidates;
};

/**
 * Fetch with a timeout backed by AbortController.
 * Prevents hanging indefinitely when a URL is unreachable.
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Direct fetch helper with auto-fallback for emulator & device networking.
 * Each candidate URL is given a 10-second window before moving to the next.
 */
const apiRequest = async (path: string, payload: any) => {
  const urls = getCandidateUrls(path);
  let lastError: any = null;

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
        FETCH_TIMEOUT_MS,
      );

      let data: any;
      try {
        data = await response.json();
      } catch (parseErr) {
        data = {message: `Server response status: ${response.status}`};
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Request failed with status ${response.status}`,
        );
      }

      return data;
    } catch (error: any) {
      lastError = error;

      const isNetworkError =
        error?.message?.includes('Network request failed') ||
        error?.message?.includes('Failed to fetch') ||
        error?.name === 'TypeError' ||
        error?.name === 'AbortError';

      // If it's a real API error (400, 401, etc.), throw immediately
      if (!isNetworkError) {
        throw error;
      }
      // Otherwise try the next candidate URL
    }
  }

  throw new Error(
    `Unable to reach backend server at ${API_BASE_URL}. Please ensure your backend server is running on port 8080 (e.g. 'npm start' in Demo/vyapar-backend).`,
  );
};

export const authService = {
  /**
   * Register a new user business account
   */
  signup: async (payload: SignupPayload) => {
    try {
      return await apiRequest('/signup', payload);
    } catch (error: any) {
      console.error('Signup Error:', error);
      throw error;
    }
  },

  /**
   * Authenticate existing user
   */
  login: async (payload: LoginPayload) => {
    try {
      return await apiRequest('/login', payload);
    } catch (error: any) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  /**
   * Request password reset OTP
   */
  forgotPassword: async (email: string) => {
    try {
      return await apiRequest('/forgot-password', { email: email.trim().toLowerCase() });
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP code
   */
  verifyOTP: async (email: string, otp: string) => {
    try {
      return await apiRequest('/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  },

  /**
   * Reset Password with OTP
   */
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    try {
      return await apiRequest('/reset-password', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: newPassword,
      });
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      throw error;
    }
  },
};