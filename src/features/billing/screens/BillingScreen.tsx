import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/AppHeader';
import { paperIcon } from '@shared/components/Icon';
import { ProductSearchBar } from '../components/ProductSearchBar';
import { ProductQuickAdd } from '../components/ProductQuickAdd';
import { CartItemRow } from '../components/CartItemRow';
import { CartSummary } from '../components/CartSummary';
import { PaymentModeSelector } from '../components/PaymentModeSelector';
import { useBillingStore } from '../store/useBillingStore';
import { billRepository } from '../repositories/billRepository';
import Product from '@core/database/models/Product';
import { PAYMENT_MODES } from '@core/constants';

interface NavigationProp {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
}

export const BillingScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
    const theme = useTheme();
    const { t } = useTranslation('billing');
    const {
        cartItems,
        subtotal,
        discount,
        grandTotal,
        paymentMode,
        selectedCustomerId,
        addToCart,
        updateQuantity,
        removeFromCart,
        setPaymentMode,
        clearCart,
    } = useBillingStore();

    const handleAddProduct = (product: Product) => {
        if (product.currentStock <= 0) {
            Alert.alert(t('outOfStock'), t('outOfStockMessage'));
            return;
        }

        addToCart({
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.sellingPrice,
            discount: 0,
            unit: product.unit,
            availableStock: product.currentStock,
        });
    };

    const handleCreateBill = async () => {
        if (cartItems.length === 0) {
            Alert.alert(t('emptyCart'), t('emptyCartMessage'));
            return;
        }

        if (paymentMode === PAYMENT_MODES.CREDIT && !selectedCustomerId) {
            Alert.alert(t('selectCustomer'), t('noCustomerForCredit'));
            return;
        }

        try {
            const bill = await billRepository.createBill(
                cartItems,
                paymentMode,
                selectedCustomerId,
                discount,
                subtotal,
                grandTotal,
            );
            clearCart();
            navigation.navigate('BillPreview', { billId: bill.id });
        } catch {
            Alert.alert(t('common:error'), t('billCreationError'));
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <AppHeader
                title={t('newBill')}
                actions={[
                    { icon: 'history', onPress: () => navigation.navigate('BillHistory') },
                    ...(cartItems.length > 0
                        ? [{ icon: 'trash-2', onPress: clearCart }]
                        : []),
                ]}
            />

            <ProductSearchBar onSelectProduct={handleAddProduct} />

            {cartItems.length === 0 ? (
                <ProductQuickAdd
                    onAddProduct={handleAddProduct}
                    cartProductIds={cartItems.map((item) => item.productId)}
                />
            ) : (
                <ScrollView style={styles.cartSection}>
                    {cartItems.map((item) => (
                        <CartItemRow
                            key={item.productId}
                            item={item}
                            onUpdateQuantity={(qty) => updateQuantity(item.productId, qty)}
                            onRemove={() => removeFromCart(item.productId)}
                        />
                    ))}
                </ScrollView>
            )}

            {cartItems.length > 0 && (
                <View style={[styles.bottomSection, { borderTopColor: theme.colors.outlineVariant }]}>
                    <PaymentModeSelector
                        value={paymentMode}
                        onChange={setPaymentMode}
                        showCredit={!!selectedCustomerId}
                    />

                    <CartSummary
                        subtotal={subtotal}
                        discount={discount}
                        grandTotal={grandTotal}
                        itemCount={cartItems.length}
                    />

                    <View style={styles.actionRow}>
                        <Button
                            mode="outlined"
                            onPress={() =>
                                navigation.navigate('CustomersTab', {
                                    screen: 'CustomerList',
                                    params: { selectionMode: true },
                                })
                            }
                            icon={paperIcon('user')}
                            style={styles.customerButton}
                        >
                            {selectedCustomerId ? t('changeCustomer') : t('selectCustomer')}
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleCreateBill}
                            icon={paperIcon('check')}
                            style={styles.createButton}
                        >
                            {t('createBill')}
                        </Button>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cartSection: {
        flex: 1,
    },
    bottomSection: {
        borderTopWidth: 1,
        paddingBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    customerButton: {
        flex: 1,
    },
    createButton: {
        flex: 1,
    },
});
