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
            searchPaths: ["./app", "./src"],
            // Add this for production builds
            mode: "transformOnly"
          }
        ],
        // Reanimated must be last
        "react-native-reanimated/plugin"
      ],
    };
  };