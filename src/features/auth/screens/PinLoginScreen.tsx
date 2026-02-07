import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { PinPad } from '../components/PinPad';
import { useAuthStore } from '../store/useAuthStore';

export const PinLoginScreen: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('auth');
  const { verifyAndLogin } = useAuthStore();
  const [error, setError] = useState(false);

  const handlePinComplete = (pin: string) => {
    const success = verifyAndLogin(pin);
    if (!success) {
      setError(true);
    }
  };

  const handleErrorEnd = () => {
    setError(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={styles.icon}>🏪</Text>
        </View>

        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('welcomeBack')}
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          {t('enterPin')}
        </Text>

        <PinPad
          onComplete={handlePinComplete}
          error={error}
          onErrorAnimationEnd={handleErrorEnd}
        />

        {error && (
          <Text variant="bodyMedium" style={[styles.errorText, { color: theme.colors.error }]}>
            {t('wrongPin')}
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
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
