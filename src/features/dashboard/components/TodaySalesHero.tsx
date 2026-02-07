import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';
import { Colors } from '@core/theme/colors';

interface TodaySalesHeroProps {
    todaySales: number;
    todayBillCount: number;
    monthSales: number;
}

export const TodaySalesHero: React.FC<TodaySalesHeroProps> = ({
    todaySales,
    todayBillCount,
    monthSales,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('dashboard');

    const avgBill = todayBillCount > 0 ? todaySales / todayBillCount : 0;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.heroContent}>
                <View style={styles.mainStat}>
                    <Text variant="labelLarge" style={styles.whiteLabel}>
                        {t('todaySales')}
                    </Text>
                    <CurrencyText
                        amount={todaySales}
                        variant="displaySmall"
                        color="#FFFFFF"
                    />
                </View>

                <View style={styles.subStats}>
                    <View style={styles.subStat}>
                        <View style={[styles.subStatIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <AppIcon name="receipt" size={16} color="#FFFFFF" />
                        </View>
                        <View>
                            <Text variant="titleMedium" style={styles.whiteText}>
                                {todayBillCount}
                            </Text>
                            <Text variant="labelSmall" style={styles.whiteSubLabel}>
                                {t('bills')}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.subStatDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />

                    <View style={styles.subStat}>
                        <View style={[styles.subStatIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <AppIcon name="chart-line" size={16} color="#FFFFFF" />
                        </View>
                        <View>
                            <CurrencyText
                                amount={avgBill}
                                variant="titleMedium"
                                color="#FFFFFF"
                            />
                            <Text variant="labelSmall" style={styles.whiteSubLabel}>
                                {t('avgBillValue')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Monthly trend strip */}
            <View style={[styles.monthStrip, { backgroundColor: Colors.primaryDark }]}>
                <View style={styles.monthStripContent}>
                    <AppIcon name="chart-bar" size={16} color="rgba(255,255,255,0.7)" />
                    <Text variant="labelMedium" style={styles.monthLabel}>
                        {t('monthSales')}
                    </Text>
                </View>
                <CurrencyText amount={monthSales} variant="titleSmall" color="#FFFFFF" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    heroContent: {
        padding: 20,
    },
    mainStat: {
        alignItems: 'center',
        marginBottom: 20,
    },
    whiteLabel: {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    whiteText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    whiteSubLabel: {
        color: 'rgba(255,255,255,0.7)',
        marginTop: 1,
    },
    subStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    subStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    subStatIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subStatDivider: {
        width: 1,
        height: 32,
    },
    monthStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    monthStripContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    monthLabel: {
        color: 'rgba(255,255,255,0.8)',
    },
});
