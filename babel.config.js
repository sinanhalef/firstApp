module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowlist: [
            'FIREBASE_API_KEY',
            'FIREBASE_AUTH_DOMAIN',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_STORAGE_BUCKET',
            'FIREBASE_MESSAGING_SENDER_ID',
            'FIREBASE_APP_ID',
            'FIREBASE_MEASUREMENT_ID',
            'FIREBASE_DATABASE_URL',
          ],
          safe: false,
          allowUndefined: false,
        },
      ],
      // NOTE: This plugin must be listed last.
      'react-native-reanimated/plugin',
    ],
  };
};
