import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { CombinedLightTheme } from '@core/theme';

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={CombinedLightTheme as any}>
        <NavigationContainer>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react-native';
export { renderWithProviders as render };
