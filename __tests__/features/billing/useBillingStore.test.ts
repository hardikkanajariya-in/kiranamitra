import { useBillingStore } from '@features/billing/store/useBillingStore';
import { createMockCartItem, resetIdCounter } from '../../factories';

describe('useBillingStore', () => {
  beforeEach(() => {
    resetIdCounter();
    useBillingStore.setState({
      cartItems: [],
      selectedCustomerId: null,
      discount: 0,
      paymentMode: 'cash',
      notes: '',
      subtotal: 0,
      grandTotal: 0,
    });
  });

  it('should initialize with empty cart', () => {
    const state = useBillingStore.getState();
    expect(state.cartItems).toHaveLength(0);
    expect(state.subtotal).toBe(0);
    expect(state.grandTotal).toBe(0);
  });

  it('should add item to cart', () => {
    const { addToCart } = useBillingStore.getState();
    const item = createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2 });
    addToCart(item);

    const state = useBillingStore.getState();
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].productId).toBe('p1');
  });

  it('should update existing item quantity', () => {
    const { addToCart } = useBillingStore.getState();
    const item = createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 1 });
    addToCart(item);

    const { updateQuantity } = useBillingStore.getState();
    updateQuantity('p1', 3);
    const state = useBillingStore.getState();
    expect(state.cartItems[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1' }));
    addToCart(createMockCartItem({ productId: 'p2' }));

    const { removeFromCart } = useBillingStore.getState();
    removeFromCart('p1');
    const state = useBillingStore.getState();
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].productId).toBe('p2');
  });

  it('should clear cart', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1' }));
    addToCart(createMockCartItem({ productId: 'p2' }));

    const { clearCart } = useBillingStore.getState();
    clearCart();
    const state = useBillingStore.getState();
    expect(state.cartItems).toHaveLength(0);
    expect(state.selectedCustomerId).toBeNull();
    expect(state.discount).toBe(0);
  });

  it('should set customer', () => {
    const { setCustomer } = useBillingStore.getState();
    setCustomer('c1');

    const state = useBillingStore.getState();
    expect(state.selectedCustomerId).toBe('c1');
  });

  it('should set discount', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2, total: 200 }));
    const { setBillDiscount } = useBillingStore.getState();
    setBillDiscount(50);

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
