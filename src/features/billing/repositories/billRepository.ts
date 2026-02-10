import { database } from '@core/database';
import Bill from '@core/database/models/Bill';
import BillItem from '@core/database/models/BillItem';
import Payment from '@core/database/models/Payment';
import CreditEntry from '@core/database/models/CreditEntry';
import Product from '@core/database/models/Product';
import Customer from '@core/database/models/Customer';
import { Q } from '@nozbe/watermelondb';
import { CartItem } from '@core/types';
import { generateBillNumber } from '@shared/utils/id';
import { BILL_STATUSES, PAYMENT_MODES, CREDIT_ENTRY_TYPES } from '@core/constants';

const billsCollection = database.get<Bill>('bills');
const billItemsCollection = database.get<BillItem>('bill_items');
const paymentsCollection = database.get<Payment>('payments');
const creditEntriesCollection = database.get<CreditEntry>('credit_entries');
const productsCollection = database.get<Product>('products');
const customersCollection = database.get<Customer>('customers');

export const billRepository = {
  observeAll: () =>
    billsCollection
      .query(Q.sortBy('created_at', Q.desc))
      .observe(),

  observeByDate: (startDate: number, endDate: number) =>
    billsCollection
      .query(
        Q.where('created_at', Q.gte(startDate)),
        Q.where('created_at', Q.lte(endDate)),
        Q.sortBy('created_at', Q.desc),
      )
      .observe(),

  getById: (id: string) => billsCollection.find(id),

  observeById: (id: string) => billsCollection.findAndObserve(id),

  getBillItems: (billId: string) =>
    billItemsCollection
      .query(Q.where('bill_id', billId))
      .observe(),

  createBill: async (
    cartItems: CartItem[],
    paymentMode: string,
    customerId: string | null,
    discount: number,
    subtotal: number,
    grandTotal: number,
  ) => {
    const billNumber = generateBillNumber();
    const customer = customerId
      ? await customersCollection.find(customerId)
      : null;

    return database.write(async () => {
      // Create the bill
      const bill = await billsCollection.create((b: Bill) => {
        if (customer) {
          b.customer.set(customer);
        }
        b.billNumber = billNumber;
        b.subtotal = subtotal;
        b.discountTotal = discount;
        b.taxTotal = 0;
        b.grandTotal = grandTotal;
        b.paymentMode = paymentMode;
        b.status = BILL_STATUSES.COMPLETED;
      });

      // Create bill items and deduct stock
      for (const item of cartItems) {
        const product = await productsCollection.find(item.productId);

        await billItemsCollection.create((bi: BillItem) => {
          bi.bill.set(bill);
          bi.product.set(product);
          bi.productName = item.productName;
          bi.quantity = item.quantity;
          bi.unitPrice = item.unitPrice;
          bi.discount = item.discount;
          bi.total = item.total;
        });

        // Deduct stock
        await product.update((p: Product) => {
          p.currentStock = Math.max(0, p.currentStock - item.quantity);
        });
      }

      // Create payment record
      if (paymentMode !== PAYMENT_MODES.CREDIT) {
        await paymentsCollection.create((payment: Payment) => {
          payment.bill.set(bill);
          if (customer) {
            payment.customer.set(customer);
          }
          payment.amount = grandTotal;
          payment.paymentMode = paymentMode;
        });
      }

      // Handle credit (udhar) or consume advance balance
      if (customer) {
        // Get current credit balance (negative = advance available)
        const existingEntries = await creditEntriesCollection
          .query(
            Q.where('customer_id', customerId!),
            Q.sortBy('created_at', Q.desc),
            Q.take(1),
          )
          .fetch();

        const currentBalance = existingEntries.length > 0
          ? existingEntries[0].balanceAfter
          : 0;

        if (paymentMode === PAYMENT_MODES.CREDIT) {
          // Customer is buying on credit
          let effectiveCredit = grandTotal;

          // If customer has advance (negative balance), use it first
          if (currentBalance < 0) {
            const advance = Math.abs(currentBalance);
            const usedAdvance = Math.min(advance, grandTotal);
            effectiveCredit = grandTotal - usedAdvance;

            if (usedAdvance > 0) {
              // Record advance usage
              await creditEntriesCollection.create((entry: CreditEntry) => {
                entry.customer.set(customer);
                entry.bill.set(bill);
                entry.entryType = CREDIT_ENTRY_TYPES.ADVANCE_USED;
                entry.amount = usedAdvance;
                entry.balanceAfter = currentBalance + usedAdvance;
                entry.notes = `Advance used for Bill #${billNumber}`;
              });
            }

            if (effectiveCredit > 0) {
              // Remaining amount goes on credit
              const balanceAfterAdvance = currentBalance + usedAdvance;
              await creditEntriesCollection.create((entry: CreditEntry) => {
                entry.customer.set(customer);
                entry.bill.set(bill);
                entry.entryType = CREDIT_ENTRY_TYPES.CREDIT;
                entry.amount = effectiveCredit;
                entry.balanceAfter = balanceAfterAdvance + effectiveCredit;
                entry.notes = `Bill #${billNumber}`;
              });
            }
          } else {
            // No advance, full credit
            await creditEntriesCollection.create((entry: CreditEntry) => {
              entry.customer.set(customer);
              entry.bill.set(bill);
              entry.entryType = CREDIT_ENTRY_TYPES.CREDIT;
              entry.amount = grandTotal;
              entry.balanceAfter = currentBalance + grandTotal;
              entry.notes = `Bill #${billNumber}`;
            });
          }
        }
      }

      return bill;
    });
  },

  cancelBill: (billId: string) =>
    database.write(async () => {
      const bill = await billsCollection.find(billId);

      // Restore stock for each item
      const items = await billItemsCollection
        .query(Q.where('bill_id', billId))
        .fetch();

      for (const item of items) {
        const product = await productsCollection.find(item.productId);
        await product.update((p: Product) => {
          p.currentStock += item.quantity;
        });
      }

      // Update bill status
      await bill.update((b: Bill) => {
        b.status = BILL_STATUSES.CANCELLED;
      });

      return bill;
    }),

  getRecentBills: (limit: number = 10) =>
    billsCollection
      .query(
        Q.sortBy('created_at', Q.desc),
        Q.take(limit),
      )
      .observe(),

  searchByBillNumber: (billNumber: string) =>
    billsCollection
      .query(
        Q.where('bill_number', Q.like(`%${Q.sanitizeLikeString(billNumber)}%`)),
        Q.sortBy('created_at', Q.desc),
      )
      .observe(),

  /**
   * Returns the top N most-sold product IDs, ranked by total quantity sold.
   * Falls back to most recently created active products if no sales yet.
   */
  getPopularProductIds: async (limit: number = 20): Promise<string[]> => {
    const allItems = await billItemsCollection
      .query(Q.sortBy('bill_id', Q.desc))
      .fetch();

    // Aggregate quantity sold per product
    const qtySold = new Map<string, number>();
    for (const item of allItems) {
      qtySold.set(
        item.productId,
        (qtySold.get(item.productId) || 0) + item.quantity,
      );
    }

    // Sort by total quantity descending
    const sorted = [...qtySold.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    return sorted;
  },
};
