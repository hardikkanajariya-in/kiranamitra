import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SalesSummaryCard } from '../components/SalesSummaryCard';
import { UdharSummaryCard } from '../components/UdharSummaryCard';
import { LowStockAlert } from '../components/LowStockAlert';
import { QuickActions } from '../components/QuickActions';
import { useDashboardData } from '../hooks/useDashboardData';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { getGreeting } from '@shared/utils/date';
import { AppHeader } from '@shared/components/AppHeader';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const DashboardScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('dashboard');
    const dashboardData = useDashboardData();
    const greeting = getGreeting();

    const handleNewBill = () => navigation.navigate('BillingTab', { screen: 'BillingHome' });
    const handleAddCustomer = () =>
        navigation.navigate('CustomersTab', { screen: 'CustomerForm' });
    const handleAddProduct = () =>
        navigation.navigate('InventoryTab', { screen: 'ProductForm' });
    const handleCollectPayment = () =>
        navigation.navigate('CustomersTab', { screen: 'CustomerList' });
    const handleViewLowStock = () =>
        navigation.navigate('InventoryTab', { screen: 'InventoryOverview' });
    const handleViewUdhar = () =>
        navigation.navigate('CustomersTab', { screen: 'CustomerList' });

    if (dashboardData.isLoading) {
        return <LoadingOverlay visible />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader title={t('title')} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.greetingContainer}>
                    <Text variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                        {t(greeting)} 👋
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {t('dashboardSubtitle')}
                    </Text>
                </View>

                <SalesSummaryCard
                    todaySales={dashboardData.todaySales}
                    todayBillCount={dashboardData.todayBillCount}
                    monthSales={dashboardData.monthSales}
                />

                <UdharSummaryCard
                    totalUdhar={dashboardData.totalUdhar}
                    totalCustomers={dashboardData.totalCustomers}
                    onPress={handleViewUdhar}
                />

                <LowStockAlert
                    lowStockCount={dashboardData.lowStockProducts}
                    outOfStockCount={dashboardData.outOfStockProducts}
                    onPress={handleViewLowStock}
                />
            </ScrollView>

            <QuickActions
                onNewBill={handleNewBill}
                onAddCustomer={handleAddCustomer}
                onAddProduct={handleAddProduct}
                onCollectPayment={handleCollectPayment}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 80,
    },
    greetingContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
});
