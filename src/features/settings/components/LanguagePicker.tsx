import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/useSettingsStore';

const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
];

export const LanguagePicker: React.FC = () => {
  const theme = useTheme();
  const { i18n, t } = useTranslation('settings');
  const { language, setLanguage } = useSettingsStore();

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
        {t('language')}
      </Text>
      <RadioButton.Group onValueChange={handleLanguageChange} value={language}>
        {LANGUAGES.map((lang) => (
          <RadioButton.Item
            key={lang.code}
            label={`${lang.nativeLabel} (${lang.label})`}
            value={lang.code}
            style={styles.radioItem}
          />
        ))}
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  radioItem: {
    paddingHorizontal: 16,
  },
});
