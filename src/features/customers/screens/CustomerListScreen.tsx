import React, { useState, useEffect } from 'react';
import { StyleSheet, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { SearchInput } from '@shared/components/SearchInput';
import { EmptyState } from '@shared/components/EmptyState';
import { LoadingOverlay } from '@shared/components/LoadingOverlay';
import { CustomerCard } from '../components/CustomerCard';
import { useCustomers } from '../hooks/useCustomers';
import Customer from '@core/database/models/Customer';
import { customerRepository } from '../repositories/customerRepository';
import { useBillingStore } from '@features/billing/store/useBillingStore';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

interface RouteProp {
    params?: { selectionMode?: boolean };
}

export const CustomerListScreen: React.FC<{ navigation: NavigationProp; route: RouteProp }> = ({
    navigation,
    route,
}) => {
    const theme = useTheme();
    const { t } = useTranslation('customers');
    const [searchQuery, setSearchQuery] = useState('');
    const { customers, isLoading } = useCustomers(searchQuery);
    const [creditMap, setCreditMap] = useState<Record<string, number>>({});
    const selectionMode = route.params?.selectionMode ?? false;
    const setCustomer = useBillingStore((state) => state.setCustomer);

    useEffect(() => {
        const loadCredits = async () => {
            try {
                const map: Record<string, number> = {};
                for (const customer of customers) {
                    map[customer.id] = await customerRepository.getOutstandingCredit(customer.id);
                }
                setCreditMap(map);
            } catch (error) {
                console.error('Failed to load credits:', error);
            }
        };
        if (customers.length > 0) {
            loadCredits();
        }
    }, [customers]);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    if (isLoading) {
        return <LoadingOverlay visible />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('title')}
                actions={[
                    { icon: 'plus', onPress: () => navigation.navigate('CustomerForm') },
                ]}
            />

            <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('searchCustomer')}
            />

            {customers.length === 0 ? (
                <EmptyState
                    icon="account-group"
                    title={t('noCustomers')}
                    subtitle={t('noCustomersSubtitle')}
                    actionLabel={t('addCustomer')}
                    onAction={() => navigation.navigate('CustomerForm')}
                />
            ) : (
                <FlashList
                    data={customers}
                    renderItem={({ item }: { item: Customer }) => (
                        <CustomerCard
                            name={item.name}
                            phone={item.phone}
                            outstandingCredit={creditMap[item.id]}
                            onPress={() => {
                                if (selectionMode) {
                                    setCustomer(item.id);
                                    navigation.goBack();
                                } else {
                                    navigation.navigate('CustomerDetail', { customerId: item.id });
                                }
                            }}
                            onCall={item.phone ? () => handleCall(item.phone) : undefined}
                        />
                    )}
                    keyExtractor={(item: Customer) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
});
