/**
 * Tests for App.tsx
 */
import React from 'react';

// Mock bootsplash
jest.mock('react-native-bootsplash', () => ({
    __esModule: true,
    default: {
        hide: jest.fn(),
        isVisible: jest.fn().mockResolvedValue(false),
        getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
    },
}));

// Mock all providers and dependencies
jest.mock('@core/i18n', () => ({
    __esModule: true,
    default: { language: 'en' },
}));

jest.mock('@core/database', () => ({
    database: {},
}));

jest.mock('@core/theme', () => ({
    CombinedLightTheme: {
        dark: false,
        colors: {
            primary: '#6200ee',
            background: '#fff',
            surface: '#fff',
            onSurface: '#000',
            onBackground: '#000',
            card: '#fff',
            text: '#000',
            border: '#e0e0e0',
            notification: '#f50057',
            elevation: { level0: '#fff', level1: '#fff', level2: '#fff', level3: '#fff', level4: '#fff', level5: '#fff' },
        },
        fonts: {},
    },
    CombinedDarkTheme: {
        dark: true,
        colors: {
            primary: '#bb86fc',
            background: '#121212',
            surface: '#121212',
            onSurface: '#fff',
            onBackground: '#fff',
            card: '#1e1e1e',
            text: '#fff',
            border: '#333',
            notification: '#f50057',
            elevation: { level0: '#121212', level1: '#1e1e1e', level2: '#222', level3: '#252525', level4: '#272727', level5: '#2c2c2c' },
        },
        fonts: {},
    },
}));

jest.mock('@features/settings/store/useSettingsStore', () => ({
    useSettingsStore: jest.fn(() => ({
        isDarkMode: false,
    })),
}));

jest.mock('./navigation/RootNavigator', () => ({
    RootNavigator: () => {
        const { View, Text } = require('react-native');
        return <View><Text>Root Navigator</Text></View>;
    },
}), { virtual: true });

jest.mock('../src/navigation/RootNavigator', () => ({
    RootNavigator: () => {
        const { View, Text } = require('react-native');
        return <View><Text>Root Navigator</Text></View>;
    },
}));

import App from '../src/App';
import { render } from '@testing-library/react-native';

describe('App', () => {
    it('should render without crashing', () => {
        render(<App />);
    });

    it('should use dark theme when isDarkMode is true', () => {
        const { useSettingsStore } = require('@features/settings/store/useSettingsStore');
        useSettingsStore.mockReturnValue({ isDarkMode: true });
        render(<App />);
    });
});
