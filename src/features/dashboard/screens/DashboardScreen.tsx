import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TodaySalesHero } from '../components/TodaySalesHero';
import { QuickActionGrid } from '../components/QuickActionGrid';
import { UdharSummaryCard } from '../components/UdharSummaryCard';
import { LowStockAlert } from '../components/LowStockAlert';
import { RecentBillsList } from '../components/RecentBillsList';
import { useDashboardData } from '../hooks/useDashboardData';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { getGreeting } from '@shared/utils/date';
import dayjs from 'dayjs';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const DashboardScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('dashboard');
    const dashboardData = useDashboardData();
    const greeting = getGreeting();
    const [refreshing, setRefreshing] = React.useState(false);

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
    const handleViewBills = () =>
        navigation.navigate('BillingTab', { screen: 'BillingHome' });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // The dashboard data will automatically refresh via the subscription
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    if (dashboardData.isLoading) {
        return <LoadingOverlay visible />;
    }

    const todayDate = dayjs().format('dddd, D MMMM');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {/* Greeting Header */}
                <View style={styles.greetingContainer}>
                    <View style={styles.greetingRow}>
                        <View>
                            <Text variant="headlineSmall" style={[styles.greetingText, { color: theme.colors.onBackground }]}>
                                {t(greeting)} 👋
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {todayDate}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Today's Sales Hero */}
                <TodaySalesHero
                    todaySales={dashboardData.todaySales}
                    todayBillCount={dashboardData.todayBillCount}
                    monthSales={dashboardData.monthSales}
                />

                {/* Spacer */}
                <View style={styles.sectionGap} />

                {/* Quick Actions Grid */}
                <QuickActionGrid
                    onNewBill={handleNewBill}
                    onAddCustomer={handleAddCustomer}
                    onAddProduct={handleAddProduct}
                    onCollectPayment={handleCollectPayment}
                />

                {/* Spacer */}
                <View style={styles.sectionGap} />

                {/* Alerts Row: Udhar + Low Stock */}
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

                {/* Recent Bills */}
                <View style={styles.sectionGap} />
                <RecentBillsList
                    bills={dashboardData.recentBills}
                    onViewAll={handleViewBills}
                />

                {/* Bottom spacing for tab bar */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
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
        paddingBottom: 16,
    },
    greetingContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    greetingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingText: {
        fontWeight: '700',
        marginBottom: 2,
    },
    sectionGap: {
        height: 20,
    },
    bottomSpacer: {
        height: 24,
    },
});
