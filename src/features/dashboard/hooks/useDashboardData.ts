import { useState, useEffect } from 'react';
import { database } from '@core/database';
import Bill from '@core/database/models/Bill';
import Customer from '@core/database/models/Customer';
import Product from '@core/database/models/Product';
import CreditEntry from '@core/database/models/CreditEntry';
import { Q } from '@nozbe/watermelondb';
import { getStartOfDay, getEndOfDay, getStartOfMonth } from '@shared/utils/date';
import { BILL_STATUSES } from '@core/constants';

interface DashboardData {
  todaySales: number;
  todayBillCount: number;
  monthSales: number;
  totalCustomers: number;
  totalUdhar: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  recentBills: Bill[];
  isLoading: boolean;
}

export const useDashboardData = (): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    todaySales: 0,
    todayBillCount: 0,
    monthSales: 0,
    totalCustomers: 0,
    totalUdhar: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    recentBills: [],
    isLoading: true,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const now = new Date();
        const todayStart = getStartOfDay(now).valueOf();
        const todayEnd = getEndOfDay(now).valueOf();
        const monthStart = getStartOfMonth(now).valueOf();

        const billsCollection = database.get<Bill>('bills');
        const customersCollection = database.get<Customer>('customers');
        const productsCollection = database.get<Product>('products');

        // Today's bills
        const todayBills = await billsCollection
          .query(
            Q.where('created_at', Q.gte(todayStart)),
            Q.where('created_at', Q.lte(todayEnd)),
            Q.where('status', Q.notEq(BILL_STATUSES.CANCELLED)),
          )
          .fetch();

        const todaySales = todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0);

        // Month's bills
        const monthBills = await billsCollection
          .query(
            Q.where('created_at', Q.gte(monthStart)),
            Q.where('status', Q.notEq(BILL_STATUSES.CANCELLED)),
          )
          .fetch();

        const monthSales = monthBills.reduce((sum, bill) => sum + bill.grandTotal, 0);

        // Total customers
        const activeCustomers = await customersCollection
          .query(Q.where('is_active', true))
          .fetchCount();

        // Total outstanding credit (udhar)
        const creditEntriesCollection = database.get<CreditEntry>('credit_entries');
        const allCustomers = await customersCollection
          .query(Q.where('is_active', true))
          .fetch();

        let totalUdhar = 0;
        for (const customer of allCustomers) {
          const latestEntries = await creditEntriesCollection
            .query(
              Q.where('customer_id', customer.id),
              Q.sortBy('created_at', Q.desc),
              Q.take(1),
            )
            .fetch();
          if (latestEntries.length > 0) {
            totalUdhar += latestEntries[0].balanceAfter;
          }
        }

        // Low stock & out of stock
        const allProducts = await productsCollection
          .query(Q.where('is_active', true))
          .fetch();

        const lowStockProducts = allProducts.filter(
          (p) => p.currentStock > 0 && p.currentStock <= p.lowStockThreshold,
        ).length;

        const outOfStockProducts = allProducts.filter(
          (p) => p.currentStock <= 0,
        ).length;

        // Recent bills (last 5)
        const recentBills = await billsCollection
          .query(
            Q.sortBy('created_at', Q.desc),
            Q.take(5),
          )
          .fetch();

        setData({
          todaySales,
          todayBillCount: todayBills.length,
          monthSales,
          totalCustomers: activeCustomers,
          totalUdhar,
          lowStockProducts,
          outOfStockProducts,
          recentBills,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadDashboardData();

    // Set up a subscription to refresh every time bills table changes
    const subscription = database
      .get<Bill>('bills')
      .query()
      .observe()
      .subscribe(() => {
        loadDashboardData();
      });

    return () => subscription.unsubscribe();
  }, []);

  return data;
};
