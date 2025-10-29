/**
 * App Configuration Constants
 * 
 * Update these values based on your environment
 */

// Backend API URL for Android
// Android emulator uses 10.0.2.2 to access host machine's localhost
// IMPORTANT: Must include /api/v1 at the end!

export const API_BASE_URL = __DEV__ 
<<<<<<< Updated upstream
  ? 'http://192.168.31.251:3000/api/v1' // Android Emulator
  : 'https://your-production-api.com/api/v1';
=======
  ? 'http://10.0.2.2:3000/api/v1' // Android Emulator
//   ? 'http://127.0.0.1:3000/api/v1' // Local Development
  : 'https://your-actual-backend-url.com/api/v1'; // Replace with your actual backend URL
>>>>>>> Stashed changes

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: '@voix_token',
  USER: '@voix_user',
} as const;

// App Info
export const APP_NAME = 'VOIX';
export const APP_VERSION = '1.0.0';

