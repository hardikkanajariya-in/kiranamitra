import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';
import { CurrencyText } from '@shared/components/CurrencyText';

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
    const onPrimary = theme.colors.onPrimary;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.shadow }]}>
            <View style={styles.heroContent}>
                <View style={styles.mainStat}>
                    <Text variant="labelLarge" style={[styles.whiteLabel, { color: onPrimary + 'CC' }]}>
                        {t('todaySales')}
                    </Text>
                    <CurrencyText
                        amount={todaySales}
                        variant="displaySmall"
                        color={onPrimary}
                    />
                </View>

                <View style={styles.subStats}>
                    <View style={styles.subStat}>
                        <View style={[styles.subStatIcon, { backgroundColor: onPrimary + '33' }]}>
                            <AppIcon name="receipt" size={16} color={onPrimary} />
                        </View>
                        <View>
                            <Text variant="titleMedium" style={{ color: onPrimary, fontWeight: '700' }}>
                                {todayBillCount}
                            </Text>
                            <Text variant="labelSmall" style={{ color: onPrimary + 'B3', marginTop: 1 }}>
                                {t('bills')}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.subStatDivider, { backgroundColor: onPrimary + '4D' }]} />

                    <View style={styles.subStat}>
                        <View style={[styles.subStatIcon, { backgroundColor: onPrimary + '33' }]}>
                            <AppIcon name="chart-line" size={16} color={onPrimary} />
                        </View>
                        <View>
                            <CurrencyText
                                amount={avgBill}
                                variant="titleMedium"
                                color={onPrimary}
                            />
                            <Text variant="labelSmall" style={{ color: onPrimary + 'B3', marginTop: 1 }}>
                                {t('avgBillValue')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Monthly trend strip */}
            <View style={[styles.monthStrip, { backgroundColor: onPrimary + '1A' }]}>
                <View style={styles.monthStripContent}>
                    <AppIcon name="chart-bar" size={16} color={onPrimary + 'B3'} />
                    <Text variant="labelMedium" style={{ color: onPrimary + 'CC' }}>
                        {t('monthSales')}
                    </Text>
                </View>
                <CurrencyText amount={monthSales} variant="titleSmall" color={onPrimary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
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
        marginBottom: 4,
        letterSpacing: 0.5,
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
});
