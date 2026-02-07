import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { PAYMENT_MODES } from '@core/constants';

interface PaymentModeSelectorProps {
  value: string;
  onChange: (mode: 'cash' | 'upi' | 'card' | 'credit') => void;
  showCredit?: boolean;
}

export const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  value,
  onChange,
  showCredit = true,
}) => {
  const { t } = useTranslation('billing');

  const buttons = [
    { value: PAYMENT_MODES.CASH, label: t('cash'), icon: 'cash' },
    { value: PAYMENT_MODES.UPI, label: t('upi'), icon: 'cellphone' },
    { value: PAYMENT_MODES.CARD, label: t('card'), icon: 'credit-card' },
    ...(showCredit
      ? [{ value: PAYMENT_MODES.CREDIT, label: t('credit'), icon: 'account-clock' }]
      : []),
  ];

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={(val) => onChange(val as 'cash' | 'upi' | 'card' | 'credit')}
        buttons={buttons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
