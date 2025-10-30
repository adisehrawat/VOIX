export default {
  expo: {
    name: "Voix",
    slug: "voix-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/voixlogo.png",
    scheme: "voixapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
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
          node: "20.13.1",
          env: {
            NODE_ENV: "production",
            EXPO_USE_FAST_RESOLVER: "1",
          },
          cache: {
            key: "nativewind-cache",
          },
        },
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/voixlogo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.voixleader.voixapp",
    },
    web: {
      output: "static",
      favicon: "./assets/images/voixlogo.png",
      bundler: "metro",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      apiUrl: process.env.API_URL,
      eas: {
        projectId: "46f4b65f-6af9-49b4-aa6b-5383111c3827",
      },
    },
    owner: "voixbuzz",
  },
};
