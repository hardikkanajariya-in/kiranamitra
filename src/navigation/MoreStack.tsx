import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreStackParamList } from './types';
import { MoreMenuScreen } from './screens/MoreMenuScreen';
import { ReportsScreen } from '@features/reports/screens/ReportsScreen';
import { SalesReportScreen } from '@features/reports/screens/SalesReportScreen';
import { CreditReportScreen } from '@features/reports/screens/CreditReportScreen';
import { InventoryReportScreen } from '@features/reports/screens/InventoryReportScreen';
import { ProductPerformanceScreen } from '@features/reports/screens/ProductPerformanceScreen';
import { SettingsScreen } from '@features/settings/screens/SettingsScreen';

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreStack: React.FC = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MoreMenu" component={MoreMenuScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="SalesReport" component={SalesReportScreen} />
        <Stack.Screen name="CreditReport" component={CreditReportScreen} />
        <Stack.Screen name="InventoryReport" component={InventoryReportScreen} />
        <Stack.Screen name="ProductPerformance" component={ProductPerformanceScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
);
