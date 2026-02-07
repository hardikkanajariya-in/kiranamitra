/// <reference types="jest" />
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => { };
    return Reanimated;
});

// Mock MMKV v4 (uses createMMKV instead of new MMKV)
const mmkvStore: Record<string, any> = {};
const mockMMKVInstance = {
    getString: jest.fn((key: string) => mmkvStore[key] as string | undefined),
    set: jest.fn((key: string, value: any) => { mmkvStore[key] = value; }),
    remove: jest.fn((key: string) => { delete mmkvStore[key]; }),
    getBoolean: jest.fn((key: string) => mmkvStore[key] as boolean | undefined),
    getNumber: jest.fn((key: string) => mmkvStore[key] as number | undefined),
    contains: jest.fn((key: string) => key in mmkvStore),
    getAllKeys: jest.fn(() => Object.keys(mmkvStore)),
    clearAll: jest.fn(() => { Object.keys(mmkvStore).forEach(k => delete mmkvStore[k]); }),
};

jest.mock('react-native-mmkv', () => ({
    createMMKV: jest.fn(() => mockMMKVInstance),
}));

export { mmkvStore, mockMMKVInstance };

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
jest.mock('@react-native-documents/picker', () => ({
    pick: jest.fn(),
    types: { allFiles: '*/*' },
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

// Mock react-native-quick-crypto
jest.mock('react-native-quick-crypto', () => ({
    createHash: jest.fn((algorithm: string) => {
        let data = '';
        return {
            update: jest.fn((input: string) => {
                data = input;
                return { digest: jest.fn((_enc: string) => `mock-hash-${data}`) };
            }),
        };
    }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
    enableScreens: jest.fn(),
    enableFreeze: jest.fn(),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
            language: 'en',
        },
    }),
    initReactI18next: { type: '3rdParty', init: jest.fn() },
    Trans: ({ children }: any) => children,
}));

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn().mockReturnValue({
        Navigator: ({ children }: any) => children,
        Screen: ({ children }: any) => children,
    }),
}));

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
    createBottomTabNavigator: jest.fn().mockReturnValue({
        Navigator: ({ children }: any) => children,
        Screen: ({ children }: any) => children,
    }),
}));

// Mock dayjs
jest.mock('dayjs', () => {
    const actual = jest.requireActual('dayjs');
    return actual;
});

// Provide clearMmkvStore helper
export const clearMmkvStore = () => {
    Object.keys(mmkvStore).forEach(k => delete mmkvStore[k]);
    mockMMKVInstance.getString.mockClear();
    mockMMKVInstance.set.mockClear();
    mockMMKVInstance.remove.mockClear();
    mockMMKVInstance.getBoolean.mockClear();
    mockMMKVInstance.getNumber.mockClear();
    mockMMKVInstance.contains.mockClear();
    mockMMKVInstance.getAllKeys.mockClear();
    mockMMKVInstance.clearAll.mockClear();
};
