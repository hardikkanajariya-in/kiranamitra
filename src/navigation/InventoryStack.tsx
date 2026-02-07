import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryStackParamList } from './types';
import { ProductListScreen } from '@features/products/screens/ProductListScreen';
import { ProductDetailScreen } from '@features/products/screens/ProductDetailScreen';
import { ProductFormScreen } from '@features/products/screens/ProductFormScreen';
import { StockAdjustmentScreen } from '@features/products/screens/StockAdjustmentScreen';
import { InventoryScreen } from '@features/inventory/screens/InventoryScreen';

const Stack = createStackNavigator<InventoryStackParamList>();

export const InventoryStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
      <Stack.Screen name="StockAdjustment" component={StockAdjustmentScreen} />
      <Stack.Screen name="InventoryOverview" component={InventoryScreen} />
    </Stack.Navigator>
  );
};
