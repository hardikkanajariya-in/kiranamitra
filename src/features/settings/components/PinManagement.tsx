import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, Button, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { PinPad } from '@features/auth/components/PinPad';

type Step = 'menu' | 'verifyOld' | 'enterNew' | 'confirmNew';

export const PinManagement: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const { verifyPin, changePin } = useAuthStore();
  const [step, setStep] = useState<Step>('menu');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');

  const handleVerifyOldPin = (pin: string) => {
    if (verifyPin(pin)) {
      setError('');
      setStep('enterNew');
    } else {
      setError(t('incorrectPin'));
    }
  };

  const handleEnterNewPin = (pin: string) => {
    setNewPin(pin);
    setError('');
    setStep('confirmNew');
  };

  const handleConfirmNewPin = (pin: string) => {
    if (pin === newPin) {
      changePin(pin);
      setStep('menu');
      setNewPin('');
      setError('');
      Alert.alert(t('pinChanged'), t('pinChangedDesc'));
    } else {
      setError(t('pinMismatch'));
      setStep('enterNew');
      setNewPin('');
    }
  };

  const handleCancel = () => {
    setStep('menu');
    setNewPin('');
    setError('');
  };

  if (step === 'menu') {
    return (
      <View style={styles.container}>
        <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
          {t('pinManagement')}
        </Text>
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {t('pinDesc')}
            </Text>
            <Button
              mode="outlined"
              icon="lock-reset"
              onPress={() => setStep('verifyOld')}
              style={styles.button}
            >
              {t('changePin')}
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const getTitle = () => {
    switch (step) {
      case 'verifyOld': return t('enterCurrentPin');
      case 'enterNew': return t('enterNewPin');
      case 'confirmNew': return t('confirmNewPin');
      default: return '';
    }
  };

  const getHandler = () => {
    switch (step) {
      case 'verifyOld': return handleVerifyOldPin;
      case 'enterNew': return handleEnterNewPin;
      case 'confirmNew': return handleConfirmNewPin;
      default: return () => {};
    }
  };

  return (
    <View style={styles.pinContainer}>
      <Text variant="titleMedium" style={[styles.pinTitle, { color: theme.colors.onSurface }]}>
        {getTitle()}
      </Text>
      {error ? (
        <Text variant="bodySmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
      <PinPad onComplete={getHandler()} pinLength={4} />
      <Button mode="text" onPress={handleCancel} style={styles.cancelButton}>
        {t('cancel')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {},
  button: {
    marginTop: 12,
  },
  pinContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  pinTitle: {
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 8,
  },
});
