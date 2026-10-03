const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);

const assetRegistryPath = path.resolve(
  workspaceRoot,
  'node_modules/@react-native/assets-registry/registry.js'
);

const config = {
  watchFolders: [workspaceRoot],
  transformer: {
    assetRegistryPath,
  },
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      'react-native/asset-registry': assetRegistryPath,
      '@dailyapps/config': path.resolve(workspaceRoot, 'packages/config/src'),
      '@dailyapps/theme': path.resolve(workspaceRoot, 'packages/theme/src'),
      '@dailyapps/utils': path.resolve(workspaceRoot, 'packages/utils/src'),
      '@dailyapps/storage': path.resolve(workspaceRoot, 'packages/storage/src'),
      '@dailyapps/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
      '@dailyapps/navigation': path.resolve(workspaceRoot, 'packages/navigation/src'),
      '@dailyapps/ads': path.resolve(workspaceRoot, 'packages/ads/src'),
      '@dailyapps/analytics': path.resolve(workspaceRoot, 'packages/analytics/src'),
      '@dailyapps/permissions': path.resolve(workspaceRoot, 'packages/permissions/src'),
      '@dailyapps/media': path.resolve(workspaceRoot, 'packages/media/src'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
