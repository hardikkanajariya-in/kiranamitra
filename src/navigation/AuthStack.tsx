import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { PinCreateScreen } from '@features/auth/screens/PinCreateScreen';
import { PinLoginScreen } from '@features/auth/screens/PinLoginScreen';
import { useAuthStore } from '@features/auth/store/useAuthStore';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  const { isPinEnabled } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isPinEnabled ? (
        <Stack.Screen name="PinLogin" component={PinLoginScreen} />
      ) : (
        <Stack.Screen name="PinCreate" component={PinCreateScreen} />
      )}
    </Stack.Navigator>
  );
};
