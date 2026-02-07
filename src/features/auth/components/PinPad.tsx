import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { PIN_LENGTH } from '@core/constants';

interface PinPadProps {
  onComplete: (pin: string) => void;
  length?: number;
  error?: boolean;
  onErrorAnimationEnd?: () => void;
}

export const PinPad: React.FC<PinPadProps> = ({
  onComplete,
  length = PIN_LENGTH,
  error = false,
  onErrorAnimationEnd,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => {
        setPin('');
        onErrorAnimationEnd?.();
      });
    }
  }, [error]);

  const handlePress = useCallback(
    (digit: string) => {
      if (pin.length >= length) return;
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === length) {
        setTimeout(() => onComplete(newPin), 100);
      }
    },
    [pin, length, onComplete],
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
  }, []);

  const renderDots = () => (
    <Animated.View
      style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}
    >
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i < pin.length
                  ? error
                    ? theme.colors.error
                    : theme.colors.primary
                  : theme.colors.surfaceVariant,
              borderColor: error ? theme.colors.error : theme.colors.outline,
            },
          ]}
        />
      ))}
    </Animated.View>
  );

  const renderButton = (value: string, onPress: () => void) => (
    <TouchableOpacity
      key={value}
      style={[styles.button, { backgroundColor: theme.colors.surfaceVariant }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ];

    return (
      <View style={styles.keypad}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((digit) => renderButton(digit, () => handlePress(digit)))}
          </View>
        ))}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'transparent' }]}
            onPress={handleClear}
          >
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('auth:clear')}
            </Text>
          </TouchableOpacity>
          {renderButton('0', () => handlePress('0'))}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'transparent' }]}
            onPress={handleDelete}
          >
            <Icon name="backspace-outline" size={24} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDots()}
      {renderKeypad()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  keypad: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 24,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
