import { database } from '@core/database';
import Bill from '@core/database/models/Bill';
import Customer from '@core/database/models/Customer';
import Product from '@core/database/models/Product';
import CreditEntry from '@core/database/models/CreditEntry';
import BillItem from '@core/database/models/BillItem';
import { Q } from '@nozbe/watermelondb';
import { BILL_STATUSES } from '@core/constants';
import { formatDate } from '@shared/utils/date';
import {
    SalesReportData,
    DailySales,
    CreditReportData,
    CustomerCreditInfo,
    InventoryReportData,
    ProductStockInfo,
    ProductPerformanceData,
} from '@core/types';

const billsCollection = database.get<Bill>('bills');
const customersCollection = database.get<Customer>('customers');
const productsCollection = database.get<Product>('products');
const creditEntriesCollection = database.get<CreditEntry>('credit_entries');
const billItemsCollection = database.get<BillItem>('bill_items');

export const reportService = {
    getSalesReport: async (from: Date, to: Date): Promise<SalesReportData> => {
        const bills = await billsCollection
            .query(
                Q.where('created_at', Q.gte(from.getTime())),
                Q.where('created_at', Q.lte(to.getTime())),
                Q.where('status', Q.notEq(BILL_STATUSES.CANCELLED)),
            )
            .fetch();

        const totalSales = bills.reduce((sum: number, b: Bill) => sum + b.grandTotal, 0);
        const totalBills = bills.length;
        const averageBill = totalBills > 0 ? totalSales / totalBills : 0;

        // Group by day
        const dailyMap = new Map<string, DailySales>();
        bills.forEach((bill: Bill) => {
            const dateKey = formatDate(bill.createdAt);
            const existing = dailyMap.get(dateKey);
            if (existing) {
                existing.total += bill.grandTotal;
                existing.billCount += 1;
            } else {
                dailyMap.set(dateKey, {
                    date: dateKey,
                    total: bill.grandTotal,
                    billCount: 1,
                });
            }
        });

        // Payment mode breakdown
        const paymentBreakdown: Record<string, number> = {};
        bills.forEach((bill: Bill) => {
            paymentBreakdown[bill.paymentMode] =
                (paymentBreakdown[bill.paymentMode] || 0) + bill.grandTotal;
        });

        return {
            totalSales,
            totalBills,
            averageBill,
            dailyBreakdown: Array.from(dailyMap.values()),
        };
    },

    getCreditReport: async (): Promise<CreditReportData> => {
        const customers = await customersCollection
            .query(Q.where('is_active', true))
            .fetch();

        const customerCredits: CustomerCreditInfo[] = [];
        let totalOutstanding = 0;

        for (const customer of customers) {
            const entries = await creditEntriesCollection
                .query(
                    Q.where('customer_id', customer.id),
                    Q.sortBy('created_at', Q.desc),
                    Q.take(1),
                )
                .fetch();

            const balance = entries.length > 0 ? entries[0].balanceAfter : 0;
            if (balance > 0) {
                customerCredits.push({
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone,
                    outstanding: balance,
                    lastTransactionDate: formatDate(entries[0]?.createdAt || Date.now()),
                });
                totalOutstanding += balance;
            }
        }

        return {
            totalOutstanding,
            customers: customerCredits.sort((a, b) => b.outstanding - a.outstanding),
        };
    },

    getInventoryReport: async (): Promise<InventoryReportData> => {
        const products = await productsCollection
            .query(Q.where('is_active', true))
            .fetch();

        const productInfos: ProductStockInfo[] = products.map((p: Product) => ({
            id: p.id,
            name: p.name,
            category: '',
            currentStock: p.currentStock,
            unit: p.unit,
            purchasePrice: p.purchasePrice,
            sellingPrice: p.sellingPrice,
            stockValue: p.currentStock * p.purchasePrice,
            isLowStock: p.isLowStock,
            isOutOfStock: p.isOutOfStock,
        }));

        const totalStockValue = productInfos.reduce((sum: number, p: ProductStockInfo) => sum + p.stockValue, 0);
        const lowStockCount = productInfos.filter((p: ProductStockInfo) => p.isLowStock).length;
        const outOfStockCount = productInfos.filter((p: ProductStockInfo) => p.isOutOfStock).length;

        return {
            totalStockValue,
            lowStockCount,
            outOfStockCount,
            products: productInfos,
        };
    },

    getProductPerformance: async (from: Date, to: Date): Promise<ProductPerformanceData[]> => {
        // bill_items has no created_at column; filter by joining through bills
        const bills = await billsCollection
            .query(
                Q.where('created_at', Q.gte(from.getTime())),
                Q.where('created_at', Q.lte(to.getTime())),
                Q.where('status', Q.notEq(BILL_STATUSES.CANCELLED)),
            )
            .fetch();

        const billIds = bills.map((b: Bill) => b.id);
        if (billIds.length === 0) {
            return [];
        }

        const billItems = await billItemsCollection
            .query(
                Q.where('bill_id', Q.oneOf(billIds)),
            )
            .fetch();

        const performanceMap = new Map<string, ProductPerformanceData>();

        billItems.forEach((item: BillItem) => {
            const existing = performanceMap.get(item.productId);
            if (existing) {
                existing.quantitySold += item.quantity;
                existing.revenue += item.total;
            } else {
                performanceMap.set(item.productId, {
                    id: item.productId,
                    name: item.productName,
                    quantitySold: item.quantity,
                    revenue: item.total,
                });
            }
        });

        return Array.from(performanceMap.values()).sort(
            (a, b) => b.revenue - a.revenue,
        );
    },
};
