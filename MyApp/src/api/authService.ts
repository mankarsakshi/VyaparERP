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

/**
 * Candidate URLs for backend API connection
 */
const getCandidateUrls = (path: string): string[] => {
  const candidates = [`${API_BASE_URL}${path}`];

  if (Platform.OS === 'android') {
    const emulatorUrl = `http://10.0.2.2:8080${path}`;
    const wifiUrl = `http://10.85.57.27:8080${path}`;
    const localUrl = `http://localhost:8080${path}`;

    if (!candidates.includes(emulatorUrl)) candidates.push(emulatorUrl);
    if (!candidates.includes(localUrl)) candidates.push(localUrl);
    if (!candidates.includes(wifiUrl)) candidates.push(wifiUrl);
  }

  return candidates;
};

/**
 * Direct fetch helper with auto-fallback for emulator & device networking
 */
const apiRequest = async (path: string, payload: any) => {
  const urls = getCandidateUrls(path);
  let lastError: any = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (parseErr) {
        data = { message: `Server response status: ${response.status}` };
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      lastError = error;
      const isNetworkError =
        error?.message?.includes('Network request failed') ||
        error?.message?.includes('Failed to fetch') ||
        error?.name === 'TypeError';

      // If it's not a network connectivity error (e.g. 400 Bad Request, 401 Invalid Credentials), stop and throw immediately
      if (!isNetworkError) {
        throw error;
      }
      // Otherwise continue trying the next candidate URL
    }
  }

  throw new Error(
    `Unable to reach backend server at ${API_BASE_URL}. Please ensure your backend server is running on port 8080 (e.g. 'npm start' in Demo/vyapar-backend).`
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