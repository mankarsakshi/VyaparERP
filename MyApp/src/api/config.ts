import { Platform } from 'react-native';

/**
 * Backend API Base URL Configuration
 * 
 * Android Emulator: http://10.0.2.2:8080 (loopback to host PC localhost)
 * iOS Simulator / Web: http://localhost:8080
 * Physical Device over Wi-Fi: http://10.85.57.27:8080
 */
 
const DEV_API_URL = Platform.select({
  android: 'http://10.85.57.27:8080',
  ios: 'http://localhost:8080',
  default: 'http://localhost:8080',
});

export const API_BASE_URL = DEV_API_URL;

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  SIGNUP: `${API_BASE_URL}/signup`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
};
