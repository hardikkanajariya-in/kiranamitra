import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/useSettingsStore';

export const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const { isDarkMode, setDarkMode } = useSettingsStore();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
            {t('darkMode')}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('darkModeDesc')}
          </Text>
        </View>
        <Switch value={isDarkMode} onValueChange={setDarkMode} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
    gap: 2,
  },
});
