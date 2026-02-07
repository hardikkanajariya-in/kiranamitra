import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '@shared/components/Icon';
import { MainTabParamList } from './types';
import { DashboardStack } from './DashboardStack';
import { CustomerStack } from './CustomerStack';
import { BillingStack } from './BillingStack';
import { InventoryStack } from './InventoryStack';
import { MoreStack } from './MoreStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation('common');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: t('dashboard'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CustomersTab"
        component={CustomerStack}
        options={{
          tabBarLabel: t('customers'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BillingTab"
        component={BillingStack}
        options={{
          tabBarLabel: t('billing'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InventoryTab"
        component={InventoryStack}
        options={{
          tabBarLabel: t('inventory'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="package-variant-closed" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreStack}
        options={{
          tabBarLabel: t('more'),
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="dots-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
