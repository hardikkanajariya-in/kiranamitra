import React from 'react';
import { Chip, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type BadgeType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  type?: BadgeType;
  variant?: BadgeType;
  compact?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  type,
  variant,
  compact = false,
}) => {
  const theme = useTheme();
  const resolvedType = type ?? variant ?? 'neutral';

  const getBadgeColors = (): { bg: string; text: string } => {
    switch (resolvedType) {
      case 'success':
        return { bg: theme.colors.primaryContainer, text: theme.colors.onPrimaryContainer };
      case 'warning':
        return { bg: theme.colors.tertiaryContainer, text: theme.colors.onTertiaryContainer };
      case 'error':
        return { bg: theme.colors.errorContainer, text: theme.colors.onErrorContainer };
      case 'info':
        return { bg: theme.colors.secondaryContainer, text: theme.colors.onSecondaryContainer };
      case 'neutral':
      default:
        return { bg: theme.colors.surfaceVariant, text: theme.colors.onSurfaceVariant };
    }
  };

  const colors = getBadgeColors();

  return (
    <Chip
      mode="flat"
      compact={compact}
      style={[styles.chip, { backgroundColor: colors.bg }]}
      textStyle={[styles.text, { color: colors.text }]}
    >
      {label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
