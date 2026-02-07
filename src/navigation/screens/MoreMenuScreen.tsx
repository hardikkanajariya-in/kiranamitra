import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';

export const MoreMenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation('common');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <AppHeader title={t('more')} />
      <ScrollView>
        <List.Item
          title={t('reports')}
          description={t('viewReports')}
          left={(props) => <List.Icon {...props} icon="chart-bar" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Reports')}
        />
        <Divider />
        <List.Item
          title={t('settings')}
          description={t('manageSettings')}
          left={(props) => <List.Icon {...props} icon="cog" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Settings')}
        />
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
