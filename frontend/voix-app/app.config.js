export default {
  "expo": {
    "name": "Voix",
    "slug": "voix-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/voixlogo.png",
    "scheme": "voixapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": false,
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true,
          "NSExceptionDomains": {
            "localhost": {
              "NSExceptionAllowsInsecureHTTPLoads": true
            },
            "127.0.0.1": {
              "NSExceptionAllowsInsecureHTTPLoads": true
            }
          }
        }
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/voixlogo.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.voixleader.voixapp"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/voixlogo.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "apiUrl": process.env.API_URL,
      "eas": {
        "projectId": "facf2abd-bf00-46dc-81df-a79303afa2f9"
      }
    },
    "owner": "voixleader"
  }
};
