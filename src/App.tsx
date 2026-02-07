import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { I18nextProvider } from 'react-i18next';
import RNBootSplash from 'react-native-bootsplash';

import i18n from '@core/i18n';
import { database } from '@core/database';
import { CombinedLightTheme, CombinedDarkTheme } from '@core/theme';
import { useSettingsStore } from '@features/settings/store/useSettingsStore';
import { RootNavigator } from './navigation/RootNavigator';

const App: React.FC = () => {
  const { isDarkMode } = useSettingsStore();

  // Use user preference, fallback to system
  const theme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paperTheme = theme as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navTheme = theme as any;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <DatabaseProvider database={database}>
          <PaperProvider theme={paperTheme}>
            <SafeAreaProvider>
              <NavigationContainer
                theme={navTheme}
                onReady={() => RNBootSplash.hide({ fade: true })}
              >
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  backgroundColor={theme.colors.surface}
                />
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </PaperProvider>
        </DatabaseProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
