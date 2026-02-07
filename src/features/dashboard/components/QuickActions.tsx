import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface QuickActionsProps {
    onNewBill: () => void;
    onAddCustomer: () => void;
    onAddProduct: () => void;
    onCollectPayment: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onNewBill,
    onAddCustomer,
    onAddProduct,
    onCollectPayment,
}) => {
    const { t } = useTranslation('dashboard');
    const [fabOpen, setFabOpen] = React.useState(false);

    return (
        <FAB.Group
            open={fabOpen}
            visible
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
                {
                    icon: 'receipt',
                    label: t('newBill'),
                    onPress: onNewBill,
                },
                {
                    icon: 'account-plus',
                    label: t('addCustomer'),
                    onPress: onAddCustomer,
                },
                {
                    icon: 'package-variant',
                    label: t('addProduct'),
                    onPress: onAddProduct,
                },
                {
                    icon: 'cash-plus',
                    label: t('collectPayment'),
                    onPress: onCollectPayment,
                },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            style={styles.fab}
        />
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
});
