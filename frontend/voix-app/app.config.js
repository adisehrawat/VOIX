export default {
  expo: {
    name: "Voix",
    slug: "voix-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/voixlogo.png",
    scheme: "voixapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            localhost: {
              NSExceptionAllowsInsecureHTTPLoads: true,
            },
            "127.0.0.1": {
              NSExceptionAllowsInsecureHTTPLoads: true,
            },
          },
        },
      },
    },
    build: {
      production: {
        android: {
          buildType: "apk",
          cache: {
            key: "nativewind-cache",
          },
        },
      },
    },
    android: {
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      usesCleartextTraffic: true,
      package: "com.voixaditya.voixapp",
    },
    web: {
      output: "static",
      favicon: "./assets/images/voixlogo.png",
      bundler: "metro",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "5bf4cc8d-6868-410c-a213-2f0787baf930",
      },
    },
    owner: "voixaditya",
  },
};
