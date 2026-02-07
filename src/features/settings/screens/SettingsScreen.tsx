import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, useTheme, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { LanguagePicker } from '../components/LanguagePicker';
import { ThemeToggle } from '../components/ThemeToggle';
import { StoreProfileForm } from '../components/StoreProfileForm';
import { BackupRestore } from '../components/BackupRestore';
import { PinManagement } from '../components/PinManagement';
import { PrinterSetupModal } from '@features/printing/components/PrinterSetupModal';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const [printerModalVisible, setPrinterModalVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader title={t('settings')} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Store Profile */}
        <StoreProfileForm />

        <Divider style={styles.divider} />

        {/* Language */}
        <LanguagePicker />

        <Divider style={styles.divider} />

        {/* Theme */}
        <ThemeToggle />

        <Divider style={styles.divider} />

        {/* Printer */}
        <List.Item
          title={t('printerSetup')}
          description={t('printerSetupDesc')}
          left={(props) => <List.Icon {...props} icon="printer" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => setPrinterModalVisible(true)}
          style={styles.listItem}
        />

        <Divider style={styles.divider} />

        {/* PIN Management */}
        <PinManagement />

        <Divider style={styles.divider} />

        {/* Backup & Restore */}
        <BackupRestore />
      </ScrollView>

      <PrinterSetupModal
        visible={printerModalVisible}
        onDismiss={() => setPrinterModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
  },
  divider: {
    marginVertical: 8,
  },
  listItem: {
    paddingHorizontal: 16,
  },
});
