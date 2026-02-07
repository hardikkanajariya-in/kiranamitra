import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { paperIcon } from '@shared/components/Icon';

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
            icon={fabOpen ? paperIcon('close') : paperIcon('plus')}
            actions={[
                {
                    icon: paperIcon('receipt'),
                    label: t('newBill'),
                    onPress: onNewBill,
                },
                {
                    icon: paperIcon('account-plus'),
                    label: t('addCustomer'),
                    onPress: onAddCustomer,
                },
                {
                    icon: paperIcon('package-variant'),
                    label: t('addProduct'),
                    onPress: onAddProduct,
                },
                {
                    icon: paperIcon('cash-plus'),
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
