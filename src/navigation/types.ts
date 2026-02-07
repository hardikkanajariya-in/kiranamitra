import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// ── Auth Stack ──
export type AuthStackParamList = {
  PinCreate: undefined;
  PinLogin: undefined;
};

// ── Dashboard Stack ──
export type DashboardStackParamList = {
  DashboardHome: undefined;
};

// ── Customer Stack ──
export type CustomerStackParamList = {
  CustomerList: undefined;
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
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// ── Screen Props helpers ──
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type DashboardScreenProps<T extends keyof DashboardStackParamList> =
  CompositeScreenProps<
    StackScreenProps<DashboardStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type CustomerScreenProps<T extends keyof CustomerStackParamList> =
  CompositeScreenProps<
    StackScreenProps<CustomerStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type InventoryScreenProps<T extends keyof InventoryStackParamList> =
  CompositeScreenProps<
    StackScreenProps<InventoryStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type BillingScreenProps<T extends keyof BillingStackParamList> =
  CompositeScreenProps<
    StackScreenProps<BillingStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

export type MoreScreenProps<T extends keyof MoreStackParamList> =
  CompositeScreenProps<
    StackScreenProps<MoreStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;
