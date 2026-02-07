import { useTheme } from 'react-native-paper';
import type { AppTheme } from './index';

export const useAppTheme = () => useTheme<AppTheme>();
