import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import { PinCreateScreen } from '@features/auth/screens/PinCreateScreen';
import { PinLoginScreen } from '@features/auth/screens/PinLoginScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PinLogin" component={PinLoginScreen} />
      <Stack.Screen name="PinCreate" component={PinCreateScreen} />
    </Stack.Navigator>
  );
};
