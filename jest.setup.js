// Mock React Native for Jest
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'android',
      Version: 34,
      select: (obj) => obj.android || obj.default,
    },
    PermissionsAndroid: {
      PERMISSIONS: {
        CAMERA: 'android.permission.CAMERA',
        WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
        READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
        POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
        RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
      },
      RESULTS: {
        GRANTED: 'granted',
        DENIED: 'denied',
        NEVER_ASK_AGAIN: 'never_ask_again',
      },
      check: jest.fn().mockResolvedValue(true),
      request: jest.fn().mockResolvedValue('granted'),
    },
    useColorScheme: () => 'light',
    Share: {
      share: jest.fn().mockResolvedValue({ action: 'sharedAction' }),
      sharedAction: 'sharedAction',
    },
    Alert: {
      alert: jest.fn(),
    },
    StyleSheet: {
      create: (styles) => styles,
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    TextInput: 'TextInput',
    Switch: 'Switch',
    Modal: 'Modal',
    ActivityIndicator: 'ActivityIndicator',
    StatusBar: 'StatusBar',
    SafeAreaView: 'SafeAreaView',
    AppRegistry: {
      registerComponent: jest.fn(),
    },
  };
});

global.__DEV__ = true;
