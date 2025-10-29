/**
 * App Configuration Constants
 * 
 * Update these values based on your environment
 */

// Backend API URL for Android
// Android emulator uses 10.0.2.2 to access host machine's localhost
// IMPORTANT: Must include /api/v1 at the end!

export const API_BASE_URL = __DEV__ 
  ? 'http://172.20.189.108:3000/api/v1' // Android Emulator
    // ? 'http://20.0.0.105:3000/api/v1' // Local Development
  : 'https://your-production-api.com/api/v1';


// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: '@voix_token',
  USER: '@voix_user',
} as const;

// App Info
export const APP_NAME = 'VOIX';
export const APP_VERSION = '1.0.0';

