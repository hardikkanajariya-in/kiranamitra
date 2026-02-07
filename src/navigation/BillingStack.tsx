import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BillingStackParamList } from './types';
import { BillingScreen } from '@features/billing/screens/BillingScreen';
import { BillPreviewScreen } from '@features/billing/screens/BillPreviewScreen';
import { BillHistoryScreen } from '@features/billing/screens/BillHistoryScreen';

const Stack = createStackNavigator<BillingStackParamList>();

export const BillingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BillingHome" component={BillingScreen} />
      <Stack.Screen name="BillPreview" component={BillPreviewScreen} />
      <Stack.Screen name="BillHistory" component={BillHistoryScreen} />
    </Stack.Navigator>
  );
};
