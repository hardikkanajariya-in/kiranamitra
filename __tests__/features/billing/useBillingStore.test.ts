import { useBillingStore } from '@features/billing/store/useBillingStore';
import { createMockCartItem, resetIdCounter } from '../../factories';

describe('useBillingStore', () => {
  beforeEach(() => {
    resetIdCounter();
    useBillingStore.setState({
      items: [],
      customerId: null,
      customerName: 'Walk-in',
      discount: 0,
      paymentMode: 'cash',
      notes: '',
    });
  });

  it('should initialize with empty cart', () => {
    const state = useBillingStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.subtotal).toBe(0);
    expect(state.grandTotal).toBe(0);
  });

  it('should add item to cart', () => {
    const { addItem } = useBillingStore.getState();
    const item = createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2 });
    addItem(item);

    const state = useBillingStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('p1');
  });

  it('should update existing item quantity', () => {
    const { addItem, updateItem } = useBillingStore.getState();
    const item = createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 1 });
    addItem(item);

    updateItem('p1', 3);
    const state = useBillingStore.getState();
    expect(state.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const { addItem, removeItem } = useBillingStore.getState();
    addItem(createMockCartItem({ productId: 'p1' }));
    addItem(createMockCartItem({ productId: 'p2' }));

    removeItem('p1');
    const state = useBillingStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('p2');
  });

  it('should clear cart', () => {
    const { addItem, clearCart } = useBillingStore.getState();
    addItem(createMockCartItem({ productId: 'p1' }));
    addItem(createMockCartItem({ productId: 'p2' }));

    clearCart();
    const state = useBillingStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.customerId).toBeNull();
    expect(state.customerName).toBe('Walk-in');
    expect(state.discount).toBe(0);
  });

  it('should set customer', () => {
    const { setCustomer } = useBillingStore.getState();
    setCustomer('c1', 'Test Customer');

    const state = useBillingStore.getState();
    expect(state.customerId).toBe('c1');
    expect(state.customerName).toBe('Test Customer');
  });

  it('should set discount', () => {
    const { addItem, setDiscount } = useBillingStore.getState();
    addItem(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2, total: 200 }));
    setDiscount(50);

    const state = useBillingStore.getState();
    expect(state.discount).toBe(50);
  });

  it('should set payment mode', () => {
    const { setPaymentMode } = useBillingStore.getState();
    setPaymentMode('upi');

    const state = useBillingStore.getState();
    expect(state.paymentMode).toBe('upi');
  });
});
