module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
      plugins: [
        [
          "react-native-css-interop/plugin",
          {
            // Helps NativeWind resolve classNames from your src/app
            searchPaths: ["./app", "./src"]
          }
        ],
        // THIS MUST BE LAST — REQUIRED even if using JS mode
        "react-native-reanimated/plugin"
      ],
    };
  };
  