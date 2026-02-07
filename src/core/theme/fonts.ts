import { configureFonts } from 'react-native-paper';
import type { MD3Type } from 'react-native-paper/lib/typescript/types';

// Using system default fonts — they handle Devanagari & Gujarati natively
const fontConfig = {
  displayLarge: { fontFamily: 'System', fontSize: 57, lineHeight: 64, letterSpacing: -0.25 },
  displayMedium: { fontFamily: 'System', fontSize: 45, lineHeight: 52, letterSpacing: 0 },
  displaySmall: { fontFamily: 'System', fontSize: 36, lineHeight: 44, letterSpacing: 0 },
  headlineLarge: { fontFamily: 'System', fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  headlineMedium: { fontFamily: 'System', fontSize: 28, lineHeight: 36, letterSpacing: 0 },
  headlineSmall: { fontFamily: 'System', fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  titleLarge: { fontFamily: 'System', fontSize: 22, lineHeight: 28, letterSpacing: 0 },
  titleMedium: { fontFamily: 'System', fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
  titleSmall: { fontFamily: 'System', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  bodyLarge: { fontFamily: 'System', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontFamily: 'System', fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontFamily: 'System', fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  labelLarge: { fontFamily: 'System', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  labelMedium: { fontFamily: 'System', fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  labelSmall: { fontFamily: 'System', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
} as const;

export const fonts = configureFonts({ config: fontConfig as any });
