import Constants from 'expo-constants';

// Get environment variables from app config
const ENV = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl,
};

// Warn if API URL is not configured (won't throw error since we have fallback)
if (!ENV.apiUrl) {
  console.warn('⚠️ API_URL is not defined. Please configure it in app.config.js or via environment variables.');
}

export default ENV;