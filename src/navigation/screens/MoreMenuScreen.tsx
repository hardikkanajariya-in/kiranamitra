import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme, List, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { paperIcon } from '@shared/components/Icon';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const MoreMenuScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('common');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader title={t('more')} />
            <ScrollView>
                <List.Item
                    title={t('reports')}
                    description={t('viewReports')}
                    left={(props) => <List.Icon {...props} icon={paperIcon('chart-bar')} />}
                    right={(props) => <List.Icon {...props} icon={paperIcon('chevron-right')} />}
                    onPress={() => navigation.navigate('Reports')}
                />
                <Divider />
                <List.Item
                    title={t('billing:billHistory')}
                    description={t('billing:viewBillHistory')}
                    left={(props) => <List.Icon {...props} icon={paperIcon('receipt')} />}
                    right={(props) => <List.Icon {...props} icon={paperIcon('chevron-right')} />}
                    onPress={() => navigation.navigate('BillingTab', { screen: 'BillHistory' })}
                />
                <Divider />
                <List.Item
                    title={t('settings')}
                    description={t('manageSettings')}
                    left={(props) => <List.Icon {...props} icon={paperIcon('cog')} />}
                    right={(props) => <List.Icon {...props} icon={paperIcon('chevron-right')} />}
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
