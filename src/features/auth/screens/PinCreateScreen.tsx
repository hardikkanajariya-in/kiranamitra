import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { PinPad } from '../components/PinPad';
import { useAuthStore } from '../store/useAuthStore';

export const PinCreateScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('auth');
  const { createPin } = useAuthStore();

  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);

  const handleFirstPin = (pin: string) => {
    setFirstPin(pin);
    setStep('confirm');
  };

  const handleConfirmPin = (pin: string) => {
    if (pin === firstPin) {
      createPin(pin);
    } else {
      setError(true);
    }
  };

  const handleErrorEnd = () => {
    setError(false);
    setStep('create');
    setFirstPin('');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          {step === 'create' ? t('createPin') : t('confirmPin')}
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {step === 'create' ? t('createPinSubtitle') : t('confirmPinSubtitle')}
        </Text>

        {step === 'create' ? (
          <PinPad key="create" onComplete={handleFirstPin} />
        ) : (
          <PinPad
            key="confirm"
            onComplete={handleConfirmPin}
            error={error}
            onErrorAnimationEnd={handleErrorEnd}
          />
        )}

        {error && (
          <Text variant="bodyMedium" style={[styles.errorText, { color: theme.colors.error }]}>
            {t('pinMismatch')}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
