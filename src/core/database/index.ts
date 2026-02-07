import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Platform } from 'react-native';

import { schema } from './schema';
import { migrations } from './migrations';

import Customer from './models/Customer';
import Category from './models/Category';
import Product from './models/Product';
import InventoryLog from './models/InventoryLog';
import Bill from './models/Bill';
import BillItem from './models/BillItem';
import Payment from './models/Payment';
import CreditEntry from './models/CreditEntry';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === 'ios',
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Customer,
    Category,
    Product,
    InventoryLog,
    Bill,
    BillItem,
    Payment,
    CreditEntry,
  ],
});

export {
  Customer,
  Category,
  Product,
  InventoryLog,
  Bill,
  BillItem,
  Payment,
  CreditEntry,
};
