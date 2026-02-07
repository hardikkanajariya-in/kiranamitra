import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { Colors } from './colors';
import { fonts } from './fonts';

// ── Light Theme ──
export const lightTheme = {
  ...MD3LightTheme,
  fonts,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    onPrimary: Colors.onPrimary,
    primaryContainer: '#C8E6C9',
    onPrimaryContainer: '#1B5E20',
    secondary: Colors.secondary,
    onSecondary: Colors.onSecondary,
    secondaryContainer: '#FFF9C4',
    onSecondaryContainer: '#F57F17',
    tertiary: Colors.tertiary,
    onTertiary: Colors.onTertiary,
    tertiaryContainer: '#B3E5FC',
    onTertiaryContainer: '#01579B',
    error: Colors.error,
    onError: Colors.onError,
    errorContainer: '#FFCDD2',
    onErrorContainer: '#B71C1C',
    background: Colors.background,
    onBackground: Colors.onBackground,
    surface: Colors.surface,
    onSurface: Colors.onSurface,
    surfaceVariant: Colors.surfaceVariant,
    onSurfaceVariant: Colors.onSurfaceVariant,
    outline: Colors.outline,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: '#F5F5F5',
      level2: '#EEEEEE',
      level3: '#E0E0E0',
      level4: '#BDBDBD',
      level5: '#9E9E9E',
    },
  },
};

// ── Dark Theme ──
export const darkTheme = {
  ...MD3DarkTheme,
  fonts,
  roundness: 12,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    onPrimary: '#003300',
    primaryContainer: '#1B5E20',
    onPrimaryContainer: '#C8E6C9',
    secondary: Colors.dark.secondary,
    onSecondary: '#3E2723',
    secondaryContainer: '#F57F17',
    onSecondaryContainer: '#FFF9C4',
    tertiary: Colors.dark.tertiary,
    onTertiary: '#002943',
    tertiaryContainer: '#01579B',
    onTertiaryContainer: '#B3E5FC',
    error: '#EF5350',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFCDD2',
    background: Colors.dark.background,
    onBackground: Colors.dark.onBackground,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.onSurface,
    surfaceVariant: Colors.dark.surfaceVariant,
    onSurfaceVariant: Colors.dark.onSurfaceVariant,
    outline: '#938F99',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#232323',
      level3: '#282828',
      level4: '#2C2C2C',
      level5: '#313131',
    },
  },
};

// ── Adapt navigation themes ──
const { LightTheme: NavLight, DarkTheme: NavDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// ── Combined themes (Paper + Navigation) ──
export const CombinedLightTheme = {
  ...lightTheme,
  ...NavLight,
  colors: {
    ...lightTheme.colors,
    ...NavLight.colors,
  },
};

export const CombinedDarkTheme = {
  ...darkTheme,
  ...NavDark,
  colors: {
    ...darkTheme.colors,
    ...NavDark.colors,
  },
};

export type AppTheme = typeof CombinedLightTheme;
