import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Surface, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { AppHeader } from '@shared/components/AppHeader';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { EmptyState } from '@shared/components/EmptyState';
import { reportService } from '../services/reportService';
import { CreditReportData, CustomerCreditInfo } from '@core/types';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const CreditReportScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('reports');
    const [report, setReport] = useState<CreditReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        reportService.getCreditReport().then((data) => {
            setReport(data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading || !report) {
        return <LoadingOverlay visible />;
    }

    const renderCustomer = ({ item, index }: { item: CustomerCreditInfo; index: number }) => (
        <Surface style={styles.customerCard} elevation={1}>
            <View style={styles.customerRow}>
                {/* Avatar / Rank */}
                <View style={[styles.avatar, { backgroundColor: theme.colors.errorContainer }]}>
                    <Text variant="labelLarge" style={{ color: theme.colors.error, fontWeight: '700' }}>
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                {/* Customer info */}
                <View style={styles.customerInfo}>
                    <Text variant="titleSmall" style={[styles.customerName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.customerMeta}>
                        {item.phone ? (
                            <View style={styles.metaItem}>
                                <AppIcon name="phone" size={12} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {item.phone}
                                </Text>
                            </View>
                        ) : null}
                        <View style={styles.metaItem}>
                            <AppIcon name="account-clock" size={12} color={theme.colors.onSurfaceVariant} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {item.lastTransactionDate}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Outstanding amount */}
                <View style={styles.amountContainer}>
                    <CurrencyText
                        amount={item.outstanding}
                        variant="titleSmall"
                        color={theme.colors.error}
                    />
                </View>
            </View>
        </Surface>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('creditReport')}
                showBack
                onBack={() => navigation.goBack()}
            />

            <View style={styles.content}>
                {/* Hero Summary */}
                <Surface style={styles.heroCard} elevation={2}>
                    <View style={styles.heroInner}>
                        <View style={[styles.heroIconBox, { backgroundColor: theme.colors.errorContainer }]}>
                            <AppIcon name="account-cash" size={28} color={theme.colors.error} />
                        </View>
                        <Text variant="labelMedium" style={[styles.heroLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {t('totalOutstanding')}
                        </Text>
                        <CurrencyText
                            amount={report.totalOutstanding}
                            variant="headlineMedium"
                            color={theme.colors.error}
                        />
                        <View style={[styles.heroBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <AppIcon name="account-group" size={14} color={theme.colors.onSurfaceVariant} />
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {report.customers.length} {t('customers')}
                            </Text>
                        </View>
                    </View>
                </Surface>

                <Divider style={styles.divider} />

                {/* Customer List */}
                {report.customers.length === 0 ? (
                    <EmptyState
                        icon="check-circle"
                        title={t('noOutstanding')}
                        subtitle={t('noOutstandingDesc')}
                    />
                ) : (
                    <FlashList
                        data={report.customers}
                        renderItem={renderCustomer}
                        // @ts-expect-error FlashList v2 moved estimatedItemSize
                        estimatedItemSize={80}
                        keyExtractor={(item: CustomerCreditInfo) => item.id}
                        contentContainerStyle={styles.listContent}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    />
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
        paddingTop: 16,
    },
    heroCard: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    heroInner: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        gap: 8,
    },
    heroIconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    heroLabel: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontSize: 11,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
    },
    divider: {
        marginVertical: 16,
        marginHorizontal: 20,
    },
    customerCard: {
        borderRadius: 12,
        marginHorizontal: 20,
        overflow: 'hidden',
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customerInfo: {
        flex: 1,
        marginLeft: 14,
        marginRight: 8,
        gap: 4,
    },
    customerName: {
        fontWeight: '600',
    },
    customerMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    listContent: {
        paddingBottom: 32,
    },
    listSeparator: {
        height: 8,
    },
});
