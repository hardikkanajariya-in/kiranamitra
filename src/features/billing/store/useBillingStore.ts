import { create } from 'zustand';
import { CartItem } from '@core/types';

interface BillingState {
  cartItems: CartItem[];
  selectedCustomerId: string | null;
  paymentMode: 'cash' | 'upi' | 'card' | 'credit';
  discount: number;
  notes: string;

  // Computed
  subtotal: number;
  grandTotal: number;

  // Actions
  addToCart: (item: Omit<CartItem, 'total'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDiscount: (productId: string, discount: number) => void;
  removeFromCart: (productId: string) => void;
  setCustomer: (customerId: string | null) => void;
  setPaymentMode: (mode: 'cash' | 'upi' | 'card' | 'credit') => void;
  setBillDiscount: (discount: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
}

const calculateItemTotal = (item: CartItem): number => {
  return item.quantity * item.unitPrice - item.discount;
};

const recalculateTotals = (cartItems: CartItem[], discount: number) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = Math.max(0, subtotal - discount);
  return { subtotal, grandTotal };
};

export const useBillingStore = create<BillingState>((set, get) => ({
  cartItems: [],
  selectedCustomerId: null,
  paymentMode: 'cash',
  discount: 0,
  notes: '',
  subtotal: 0,
  grandTotal: 0,

  addToCart: (item) => {
    const state = get();
    const existingIndex = state.cartItems.findIndex(
      (ci) => ci.productId === item.productId,
    );

    let newItems: CartItem[];

    if (existingIndex >= 0) {
      // Update existing item quantity
      newItems = state.cartItems.map((ci, index) => {
        if (index === existingIndex) {
          const updatedItem = {
            ...ci,
            quantity: ci.quantity + item.quantity,
          };
          updatedItem.total = calculateItemTotal(updatedItem);
          return updatedItem;
        }
        return ci;
      });
    } else {
      // Add new item
      const newItem: CartItem = {
        ...item,
        total: item.quantity * item.unitPrice - (item.discount || 0),
      };
      newItems = [...state.cartItems, newItem];
    }

    const totals = recalculateTotals(newItems, state.discount);
    set({ cartItems: newItems, ...totals });
  },

  updateQuantity: (productId, quantity) => {
    const state = get();
    const newItems = state.cartItems.map((ci) => {
      if (ci.productId === productId) {
        const updatedItem = { ...ci, quantity };
        updatedItem.total = calculateItemTotal(updatedItem);
        return updatedItem;
      }
      return ci;
    });

    const totals = recalculateTotals(newItems, state.discount);
    set({ cartItems: newItems, ...totals });
  },

  updateDiscount: (productId, discount) => {
    const state = get();
    const newItems = state.cartItems.map((ci) => {
      if (ci.productId === productId) {
        const updatedItem = { ...ci, discount };
        updatedItem.total = calculateItemTotal(updatedItem);
        return updatedItem;
      }
      return ci;
    });

    const totals = recalculateTotals(newItems, state.discount);
    set({ cartItems: newItems, ...totals });
  },

  removeFromCart: (productId) => {
    const state = get();
    const newItems = state.cartItems.filter((ci) => ci.productId !== productId);
    const totals = recalculateTotals(newItems, state.discount);
    set({ cartItems: newItems, ...totals });
  },

  setCustomer: (customerId) => set({ selectedCustomerId: customerId }),
  setPaymentMode: (mode) => set({ paymentMode: mode }),
  setBillDiscount: (discount) => {
    const state = get();
    const totals = recalculateTotals(state.cartItems, discount);
    set({ discount, ...totals });
  },
  setNotes: (notes) => set({ notes }),

  clearCart: () =>
    set({
      cartItems: [],
      selectedCustomerId: null,
      paymentMode: 'cash',
      discount: 0,
      notes: '',
      subtotal: 0,
      grandTotal: 0,
    }),
}));
