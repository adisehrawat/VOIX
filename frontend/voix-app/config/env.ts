import Constants from 'expo-constants';

// Get environment variables from app config
const ENV = {
//   apiUrl: Constants.expoConfig?.extra?.apiUrl,
    apiUrl: 'http://10.87.132.3:3000/api/v1',
};

// Validate that required env vars are present
if (!ENV.apiUrl) {
  throw new Error('API_URL is not defined in environment configuration');
}

export default ENV;