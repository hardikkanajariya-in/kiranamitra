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
    expect(state.subtotal).toBe(200);
    expect(state.grandTotal).toBe(200);
  });

  it('should update existing item quantity when adding duplicate', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 1 }));
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2 }));

    const state = useBillingStore.getState();
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].quantity).toBe(3);
    expect(state.subtotal).toBe(300);
  });

  it('should update existing item quantity', () => {
    const { addToCart } = useBillingStore.getState();
    const item = createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 1 });
    addToCart(item);

    const { updateQuantity } = useBillingStore.getState();
    updateQuantity('p1', 3);
    const state = useBillingStore.getState();
    expect(state.cartItems[0].quantity).toBe(3);
    expect(state.subtotal).toBe(300);
  });

  it('should not update quantity for non-existent product', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 1 }));

    const { updateQuantity } = useBillingStore.getState();
    updateQuantity('p-nonexistent', 5);
    const state = useBillingStore.getState();
    expect(state.cartItems).toHaveLength(1);
    expect(state.cartItems[0].quantity).toBe(1);
  });

  it('should update item discount', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2, discount: 0 }));

    const { updateDiscount } = useBillingStore.getState();
    updateDiscount('p1', 20);
    const state = useBillingStore.getState();
    expect(state.cartItems[0].discount).toBe(20);
    // total = 2 * 100 - 20 = 180
    expect(state.cartItems[0].total).toBe(180);
    expect(state.subtotal).toBe(180);
  });

  it('should not update discount for non-existent product', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 1 }));

    const { updateDiscount } = useBillingStore.getState();
    updateDiscount('p-nonexistent', 20);
    const state = useBillingStore.getState();
    expect(state.cartItems[0].discount).toBe(0);
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
    expect(state.paymentMode).toBe('cash');
    expect(state.notes).toBe('');
    expect(state.subtotal).toBe(0);
    expect(state.grandTotal).toBe(0);
  });

  it('should set customer', () => {
    const { setCustomer } = useBillingStore.getState();
    setCustomer('c1');
    expect(useBillingStore.getState().selectedCustomerId).toBe('c1');
  });

  it('should clear customer', () => {
    const { setCustomer } = useBillingStore.getState();
    setCustomer('c1');
    setCustomer(null);
    expect(useBillingStore.getState().selectedCustomerId).toBeNull();
  });

  it('should set bill discount and recalculate grandTotal', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 100, quantity: 2, total: 200 }));
    const { setBillDiscount } = useBillingStore.getState();
    setBillDiscount(50);

    const state = useBillingStore.getState();
    expect(state.discount).toBe(50);
    expect(state.grandTotal).toBe(150);
  });

  it('should not let grandTotal go below 0', () => {
    const { addToCart } = useBillingStore.getState();
    addToCart(createMockCartItem({ productId: 'p1', unitPrice: 10, quantity: 1, total: 10 }));
    const { setBillDiscount } = useBillingStore.getState();
    setBillDiscount(100);

    const state = useBillingStore.getState();
    expect(state.grandTotal).toBe(0);
  });

  it('should set payment mode', () => {
    const { setPaymentMode } = useBillingStore.getState();
    setPaymentMode('upi');
    expect(useBillingStore.getState().paymentMode).toBe('upi');
  });

  it('should set notes', () => {
    const { setNotes } = useBillingStore.getState();
    setNotes('Test notes');
    expect(useBillingStore.getState().notes).toBe('Test notes');
  });
});
