import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    getBoolean: jest.fn(),
    getNumber: jest.fn(),
    contains: jest.fn(),
    getAllKeys: jest.fn().mockReturnValue([]),
    clearAll: jest.fn(),
  })),
}));

// Mock WatermelonDB
jest.mock('@nozbe/watermelondb', () => {
  const actual = jest.requireActual('@nozbe/watermelondb');
  return {
    ...actual,
    Database: jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue({
        query: jest.fn().mockReturnValue({
          fetch: jest.fn().mockResolvedValue([]),
          fetchCount: jest.fn().mockResolvedValue(0),
          observe: jest.fn().mockReturnValue({
            subscribe: jest.fn(),
          }),
        }),
        find: jest.fn(),
        create: jest.fn(),
      }),
      write: jest.fn((fn) => fn()),
    })),
  };
});

// Mock SQLiteAdapter
jest.mock('@nozbe/watermelondb/adapters/sqlite', () => jest.fn());

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock @react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MockIcon');

// Mock react-native-bluetooth-escpos-printer
jest.mock('react-native-bluetooth-escpos-printer', () => ({
  BluetoothEscposPrinter: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    printerInit: jest.fn(),
    printerAlign: jest.fn(),
    printText: jest.fn(),
  },
  BluetoothManager: {
    enableBluetooth: jest.fn(),
    scanDevices: jest.fn(),
  },
  ALIGN: { LEFT: 0, CENTER: 1, RIGHT: 2 },
}));

// Mock react-native-blob-util
jest.mock('react-native-blob-util', () => ({
  default: {
    fs: {
      dirs: { DownloadDir: '/mock/downloads', CacheDir: '/mock/cache' },
      writeFile: jest.fn(),
      readFile: jest.fn(),
      cp: jest.fn(),
    },
  },
}));

// Mock react-native-share
jest.mock('react-native-share', () => ({
  default: {
    open: jest.fn(),
  },
}));

// Mock react-native-document-picker
jest.mock('react-native-document-picker', () => ({
  default: {
    pickSingle: jest.fn(),
    types: { allFiles: '*/*' },
  },
}));

// Silence console warnings in tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Require cycle')
  ) {
    return;
  }
  originalWarn(...args);
};
