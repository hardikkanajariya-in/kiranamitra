import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { formatCurrency } from '@shared/utils/currency';
import { Colors } from '@core/theme/colors';

type SizeVariant = 'large' | 'medium' | 'small';
type PaperVariant =
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';

export interface CurrencyTextProps {
  amount: number;
  style?: TextStyle;
  variant?: SizeVariant | PaperVariant;
  colored?: boolean;
  color?: string;
}

const sizeMap: Record<SizeVariant, TextStyle> = {
  large: { fontSize: 24, fontWeight: '700' },
  medium: { fontSize: 16, fontWeight: '600' },
  small: { fontSize: 12, fontWeight: '500' },
};

const paperSizeMap: Partial<Record<PaperVariant, TextStyle>> = {
  displayLarge: { fontSize: 57, fontWeight: '700' },
  displayMedium: { fontSize: 45, fontWeight: '700' },
  displaySmall: { fontSize: 36, fontWeight: '700' },
  headlineLarge: { fontSize: 32, fontWeight: '700' },
  headlineMedium: { fontSize: 28, fontWeight: '700' },
  headlineSmall: { fontSize: 24, fontWeight: '700' },
  titleLarge: { fontSize: 22, fontWeight: '600' },
  titleMedium: { fontSize: 16, fontWeight: '600' },
  titleSmall: { fontSize: 14, fontWeight: '600' },
  bodyLarge: { fontSize: 16, fontWeight: '400' },
  bodyMedium: { fontSize: 14, fontWeight: '400' },
  bodySmall: { fontSize: 12, fontWeight: '400' },
  labelLarge: { fontSize: 14, fontWeight: '600' },
  labelMedium: { fontSize: 12, fontWeight: '600' },
  labelSmall: { fontSize: 11, fontWeight: '600' },
};

export const CurrencyText: React.FC<CurrencyTextProps> = ({
  amount,
  style,
  variant = 'medium',
  colored = false,
  color,
}) => {
  const theme = useTheme();

  const sizeStyle: TextStyle =
    sizeMap[variant as SizeVariant] ??
    paperSizeMap[variant as PaperVariant] ??
    sizeMap.medium;

  const colorStyle: TextStyle = color
    ? { color }
    : colored
      ? { color: amount >= 0 ? Colors.paymentGreen : Colors.creditRed }
      : { color: theme.colors.onSurface };

  return (
    <Text style={[sizeStyle, colorStyle, style]}>
      {formatCurrency(amount)}
    </Text>
  );
};
