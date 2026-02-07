import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomerStackParamList } from './types';
import { CustomerListScreen } from '@features/customers/screens/CustomerListScreen';
import { CustomerDetailScreen } from '@features/customers/screens/CustomerDetailScreen';
import { CustomerFormScreen } from '@features/customers/screens/CustomerFormScreen';

const Stack = createStackNavigator<CustomerStackParamList>();

export const CustomerStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerList" component={CustomerListScreen} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
      <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
    </Stack.Navigator>
  );
};
