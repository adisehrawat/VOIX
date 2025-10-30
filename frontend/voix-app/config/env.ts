
// Get environment variables from app config
const ENV = {
  apiUrl: "http://44.210.156.140:3000/api/v1",
};

// Warn if API URL is not configured
if (!ENV.apiUrl) {
  console.warn('⚠️ API_URL is not defined. Please configure it in app.config.js or via environment variables.');
}

export default ENV;