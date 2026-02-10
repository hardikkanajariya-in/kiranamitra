import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ── Dashboard Stack ──
export type DashboardStackParamList = {
  DashboardHome: undefined;
};

// ── Customer Stack ──
export type CustomerStackParamList = {
  CustomerList: { selectionMode?: boolean } | undefined;
  CustomerDetail: { customerId: string };
  CustomerForm: { customerId?: string } | undefined;
};

// ── Inventory Stack ──
export type InventoryStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  ProductForm: { productId?: string } | undefined;
  StockAdjustment: { productId: string };
  InventoryOverview: undefined;
};

// ── Billing Stack ──
export type BillingStackParamList = {
  BillingHome: undefined;
  BillPreview: { billId: string };
  BillHistory: undefined;
};

// ── More (Reports + Settings) Stack ──
export type MoreStackParamList = {
  MoreMenu: undefined;
  Reports: undefined;
  SalesReport: undefined;
  CreditReport: undefined;
  InventoryReport: undefined;
  ProductPerformance: undefined;
  Settings: undefined;
};

// ── Main Tab Navigator ──
export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  CustomersTab: NavigatorScreenParams<CustomerStackParamList>;
  BillingTab: NavigatorScreenParams<BillingStackParamList>;
  InventoryTab: NavigatorScreenParams<InventoryStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

// ── Root Navigator ──
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
};

// ── Screen Props helpers ──
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type DashboardScreenProps<T extends keyof DashboardStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DashboardStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type CustomerScreenProps<T extends keyof CustomerStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CustomerStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type InventoryScreenProps<T extends keyof InventoryStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<InventoryStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type BillingScreenProps<T extends keyof BillingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<BillingStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type MoreScreenProps<T extends keyof MoreStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MoreStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;
