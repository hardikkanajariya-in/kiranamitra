import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguage } from '@core/storage/mmkv';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enCustomers from './locales/en/customers.json';
import enProducts from './locales/en/products.json';
import enInventory from './locales/en/inventory.json';
import enBilling from './locales/en/billing.json';
import enReports from './locales/en/reports.json';
import enSettings from './locales/en/settings.json';

import hiCommon from './locales/hi/common.json';
import hiAuth from './locales/hi/auth.json';
import hiDashboard from './locales/hi/dashboard.json';
import hiCustomers from './locales/hi/customers.json';
import hiProducts from './locales/hi/products.json';
import hiInventory from './locales/hi/inventory.json';
import hiBilling from './locales/hi/billing.json';
import hiReports from './locales/hi/reports.json';
import hiSettings from './locales/hi/settings.json';

import guCommon from './locales/gu/common.json';
import guAuth from './locales/gu/auth.json';
import guDashboard from './locales/gu/dashboard.json';
import guCustomers from './locales/gu/customers.json';
import guProducts from './locales/gu/products.json';
import guInventory from './locales/gu/inventory.json';
import guBilling from './locales/gu/billing.json';
import guReports from './locales/gu/reports.json';
import guSettings from './locales/gu/settings.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    customers: enCustomers,
    products: enProducts,
    inventory: enInventory,
    billing: enBilling,
    reports: enReports,
    settings: enSettings,
  },
  hi: {
    common: hiCommon,
    auth: hiAuth,
    dashboard: hiDashboard,
    customers: hiCustomers,
    products: hiProducts,
    inventory: hiInventory,
    billing: hiBilling,
    reports: hiReports,
    settings: hiSettings,
  },
  gu: {
    common: guCommon,
    auth: guAuth,
    dashboard: guDashboard,
    customers: guCustomers,
    products: guProducts,
    inventory: guInventory,
    billing: guBilling,
    reports: guReports,
    settings: guSettings,
  },
};

const savedLanguage = getLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  ns: [
    'common',
    'auth',
    'dashboard',
    'customers',
    'products',
    'inventory',
    'billing',
    'reports',
    'settings',
  ],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
