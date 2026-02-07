import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@shared/components/Icon';
import { useTranslation } from 'react-i18next';
import { CurrencyText } from '@shared/components/CurrencyText';
import { Colors } from '@core/theme/colors';

interface UdharSummaryCardProps {
  totalUdhar: number;
  totalCustomers: number;
  onPress?: () => void;
}

export const UdharSummaryCard: React.FC<UdharSummaryCardProps> = ({
  totalUdhar,
  totalCustomers,
  onPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('dashboard');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: Colors.errorBg }]}>
          <AppIcon name="account-cash" size={22} color={Colors.creditRed} />
        </View>

        <View style={styles.content}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('udharSummary')}
          </Text>
          <CurrencyText amount={totalUdhar} variant="titleLarge" color={Colors.creditRed} />
        </View>

        <View style={styles.rightSection}>
          <View style={[styles.customerBadge, { backgroundColor: Colors.errorBg }]}>
            <Text variant="titleSmall" style={{ color: Colors.creditRed, fontWeight: '700' }}>
              {totalCustomers}
            </Text>
          </View>
          <Text variant="labelSmall" style={[styles.customerLabel, { color: theme.colors.onSurfaceVariant }]}>
            {t('customersWithCredit')}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}>
        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
          {t('viewDetails')}
        </Text>
        <AppIcon name="chevron-right" size={14} color={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  rightSection: {
    alignItems: 'center',
  },
  customerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerLabel: {
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 64,
    lineHeight: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
});
