import React from 'react';
import { TextStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { formatCurrency } from '@shared/utils/currency';

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

const sizeVariantToPaper: Record<SizeVariant, PaperVariant> = {
    large: 'headlineSmall',
    medium: 'titleMedium',
    small: 'bodySmall',
};

const isPaperVariant = (v: string): v is PaperVariant =>
    ['displayLarge', 'displayMedium', 'displaySmall',
        'headlineLarge', 'headlineMedium', 'headlineSmall',
        'titleLarge', 'titleMedium', 'titleSmall',
        'bodyLarge', 'bodyMedium', 'bodySmall',
        'labelLarge', 'labelMedium', 'labelSmall'].includes(v);

export const CurrencyText: React.FC<CurrencyTextProps> = ({
    amount,
    style,
    variant = 'medium',
    colored = false,
    color,
}) => {
    const theme = useTheme();

    const paperVariant: PaperVariant = isPaperVariant(variant)
        ? variant
        : sizeVariantToPaper[variant as SizeVariant] ?? 'titleMedium';

    const getColor = (): string => {
        if (color) {
            return color;
        }
        if (colored) {
            return amount >= 0 ? theme.colors.primary : theme.colors.error;
        }
        return theme.colors.onSurface;
    };

    return (
        <Text
            variant={paperVariant}
            style={[{ color: getColor(), fontWeight: '700' }, style]}
        >
            {formatCurrency(amount)}
        </Text>
    );
};
