import { database } from '@core/database';
import Customer from '@core/database/models/Customer';
import CreditEntry from '@core/database/models/CreditEntry';
import Payment from '@core/database/models/Payment';
import { Q } from '@nozbe/watermelondb';
import { CustomerFormData } from '../schemas/customerSchema';
import { CREDIT_ENTRY_TYPES } from '@core/constants';

const customersCollection = database.get<Customer>('customers');
const creditEntriesCollection = database.get<CreditEntry>('credit_entries');
const paymentsCollection = database.get<Payment>('payments');

export const customerRepository = {
    observeAll: () =>
        customersCollection
            .query(Q.where('is_active', true), Q.sortBy('name', Q.asc))
            .observe(),

    observeById: (id: string) => customersCollection.findAndObserve(id),

    search: (searchTerm: string) =>
        customersCollection
            .query(
                Q.where('is_active', true),
                Q.or(
                    Q.where('name', Q.like(`%${Q.sanitizeLikeString(searchTerm)}%`)),
                    Q.where('phone', Q.like(`%${Q.sanitizeLikeString(searchTerm)}%`)),
                ),
                Q.sortBy('name', Q.asc),
            )
            .observe(),

    getById: (id: string) => customersCollection.find(id),

    create: (data: CustomerFormData) =>
        database.write(() =>
            customersCollection.create((customer) => {
                customer.name = data.name;
                customer.phone = data.phone || '';
                customer.address = data.address || '';
                customer.notes = data.notes || '';
                customer.isActive = true;
            }),
        ),

    update: async (id: string, data: CustomerFormData) => {
        const customer = await customersCollection.find(id);
        return database.write(() =>
            customer.update((c) => {
                c.name = data.name;
                c.phone = data.phone || '';
                c.address = data.address || '';
                c.notes = data.notes || '';
            }),
        );
    },

    deactivate: async (id: string) => {
        const customer = await customersCollection.find(id);
        return database.write(() =>
            customer.update((c) => {
                c.isActive = false;
            }),
        );
    },

    getCustomersWithCredit: () =>
        customersCollection
            .query(Q.where('is_active', true))
            .observe(),

    getCreditEntries: (customerId: string) =>
        creditEntriesCollection
            .query(
                Q.where('customer_id', customerId),
                Q.sortBy('created_at', Q.desc),
            )
            .observe(),

    addCreditPayment: async (
        customerId: string,
        amount: number,
        notes: string = '',
    ) => {
        const customer = await customersCollection.find(customerId);

        return database.write(async () => {
            // Get current credit balance
            const entries = await creditEntriesCollection
                .query(
                    Q.where('customer_id', customerId),
                    Q.sortBy('created_at', Q.desc),
                    Q.take(1),
                )
                .fetch();

            const currentBalance = entries.length > 0 ? entries[0].balanceAfter : 0;
            const newBalance = currentBalance - amount;

            // Create credit entry for payment
            const creditEntry = await creditEntriesCollection.create((entry: CreditEntry) => {
                entry.customer.set(customer);
                entry.entryType = CREDIT_ENTRY_TYPES.PAYMENT;
                entry.amount = amount;
                entry.balanceAfter = Math.max(0, newBalance);
                entry.notes = notes;
            });

            // Also create a payment record
            await paymentsCollection.create((payment: Payment) => {
                payment.customer.set(customer);
                payment.amount = amount;
                payment.paymentMode = 'cash';
                payment.notes = notes;
            });

            return creditEntry;
        });
    },

    getOutstandingCredit: async (customerId: string): Promise<number> => {
        const entries = await creditEntriesCollection
            .query(
                Q.where('customer_id', customerId),
                Q.sortBy('created_at', Q.desc),
                Q.take(1),
            )
            .fetch();

        return entries.length > 0 ? entries[0].balanceAfter : 0;
    },
};
