// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);


// -----------------------------------------------


const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, 'src/types'),
      src: path.resolve(__dirname, 'src'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
