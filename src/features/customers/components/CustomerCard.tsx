import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CurrencyText } from '@shared/components/CurrencyText';

interface CustomerCardProps {
  name: string;
  phone: string;
  outstandingCredit?: number;
  onPress: () => void;
  onCall?: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  name,
  phone,
  outstandingCredit,
  onPress,
  onCall,
}) => {
  const theme = useTheme();
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content style={styles.content}>
        <Avatar.Text
          size={48}
          label={initials}
          style={{ backgroundColor: theme.colors.primaryContainer }}
          labelStyle={{ color: theme.colors.onPrimaryContainer }}
        />

        <View style={styles.info}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {name}
          </Text>
          {phone ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {phone}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightSection}>
          {outstandingCredit !== undefined && outstandingCredit > 0 ? (
            <CurrencyText
              amount={outstandingCredit}
              variant="labelLarge"
              color={theme.colors.error}
            />
          ) : null}
          {phone && onCall ? (
            <TouchableOpacity onPress={onCall} style={styles.callButton}>
              <Icon name="phone" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  callButton: {
    padding: 4,
  },
});
