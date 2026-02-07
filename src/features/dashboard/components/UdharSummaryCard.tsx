import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { CurrencyText } from '@shared/components/CurrencyText';

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
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Icon name="account-cash" size={24} color={theme.colors.error} />
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {t('udharSummary')}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.stat}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('totalOutstanding')}
            </Text>
            <CurrencyText amount={totalUdhar} variant="headlineSmall" color={theme.colors.error} />
          </View>

          <View style={styles.stat}>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('totalCustomers')}
            </Text>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
              {totalCustomers}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
});
