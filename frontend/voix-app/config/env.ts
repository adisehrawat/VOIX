import Constants from 'expo-constants';

// Get environment variables from app config
const ENV = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl,
};

// Validate that required env vars are present
if (!ENV.apiUrl) {
  throw new Error('API_URL is not defined in environment configuration');
}

export default ENV;