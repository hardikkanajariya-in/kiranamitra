import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { formatTime } from '@shared/utils/date';
import Bill from '@core/database/models/Bill';
import { BILL_STATUSES } from '@core/constants';
import { Colors } from '@core/theme/colors';

interface RecentBillsListProps {
    bills: Bill[];
    onViewAll: () => void;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case BILL_STATUSES.COMPLETED:
            return { bg: Colors.successBg, color: Colors.success, icon: 'check-circle-outline' };
        case BILL_STATUSES.CANCELLED:
            return { bg: Colors.errorBg, color: Colors.error, icon: 'close' };
        default:
            return { bg: Colors.warningBg, color: Colors.warning, icon: 'account-clock' };
    }
};

const getPaymentIcon = (mode: string) => {
    switch (mode) {
        case 'cash':
            return 'cash';
        case 'upi':
            return 'cellphone';
        case 'card':
            return 'credit-card';
        case 'credit':
            return 'account-clock';
        default:
            return 'cash';
    }
};

export const RecentBillsList: React.FC<RecentBillsListProps> = ({ bills, onViewAll }) => {
    const theme = useTheme();
    const { t } = useTranslation('dashboard');

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
                    {t('recentBills')}
                </Text>
                <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                        {t('viewAll')}
                    </Text>
                </TouchableOpacity>
            </View>

            {bills.length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
                    <AppIcon name="receipt" size={32} color={theme.colors.outlineVariant} />
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                        {t('noBills')}
                    </Text>
                </View>
            ) : (
                <View style={[styles.billsCard, { backgroundColor: theme.colors.surface }]}>
                    {bills.map((bill, index) => {
                        const statusStyle = getStatusStyle(bill.status);
                        const isLast = index === bills.length - 1;

                        return (
                            <View key={bill.id}>
                                <View style={styles.billRow}>
                                    <View style={[styles.statusDot, { backgroundColor: statusStyle.bg }]}>
                                        <AppIcon name={getPaymentIcon(bill.paymentMode)} size={16} color={statusStyle.color} />
                                    </View>

                                    <View style={styles.billInfo}>
                                        <Text variant="bodyMedium" style={[styles.billNumber, { color: theme.colors.onSurface }]}>
                                            #{bill.billNumber}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                            {formatTime(bill.createdAt)}
                                        </Text>
                                    </View>

                                    <View style={styles.billAmount}>
                                        <CurrencyText amount={bill.grandTotal} variant="titleSmall" />
                                    </View>
                                </View>
                                {!isLast && (
                                    <View style={[styles.separator, { backgroundColor: theme.colors.outlineVariant }]} />
                                )}
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontWeight: '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    emptyCard: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    billsCard: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    billRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    statusDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    billInfo: {
        flex: 1,
    },
    billNumber: {
        fontWeight: '600',
    },
    billAmount: {
        alignItems: 'flex-end',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 48,
    },
});
