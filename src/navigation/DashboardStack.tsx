import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardStackParamList } from './types';
import { DashboardScreen } from '@features/dashboard/screens/DashboardScreen';

const Stack = createStackNavigator<DashboardStackParamList>();

export const DashboardStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    </Stack.Navigator>
  );
};
