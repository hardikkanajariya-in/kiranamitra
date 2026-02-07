import React from 'react';
import { Chip } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Colors } from '@core/theme/colors';

type BadgeType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  type?: BadgeType;
  variant?: BadgeType;
  compact?: boolean;
}

const badgeColors: Record<BadgeType, { bg: string; text: string }> = {
  success: { bg: '#E8F5E9', text: Colors.success },
  warning: { bg: '#FFF3E0', text: Colors.warning },
  error: { bg: '#FFEBEE', text: Colors.error },
  info: { bg: '#E3F2FD', text: Colors.info },
  neutral: { bg: '#F5F5F5', text: '#616161' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  type,
  variant,
  compact = false,
}) => {
  const resolvedType = type ?? variant ?? 'neutral';
  const colors = badgeColors[resolvedType];

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
