module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
    //   [
    //     "nativewind/babel",
    //     {
    //       mode: "transformOnly",
    //     },
    //   ],
      // Reanimated must be last
      "react-native-reanimated/plugin",
    ],
  };
};
