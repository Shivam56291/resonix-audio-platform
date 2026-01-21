// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

// -----------------------------------------------

/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  // leave empty unless you need custom options
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          src: './src',

          '@components': './src/components',
          '@utils': './src/utils',
          '@views': './src/views',
          '@ui': './src/ui',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@assets': './src/assets',
          '@config': './src/config',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@store': './src/store',
          '@types': './src/types',
        },
      },
    ],
    ['react-native-worklets/plugin', workletsPluginOptions],
    ['react-native-bootsplash/plugin'],
    ['react-native-reanimated/plugin'],
  ],
};
