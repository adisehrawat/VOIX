export default {
  "expo": {
    "name": "Voix",
    "slug": "voix-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/voixlogo.png",
    "scheme": "voixapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
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
    "build": {
      "production": {
        "android": {
          "buildType": "apk",
          "cache": {
            "key": "nativewind-cache"
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
      "package": "com.adityavoix.voixapp"
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
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "49029896-19d5-49de-b96a-1d26c3b2b5ee"
      }
    },
    "owner": "adityavoix"
  }
};
