import 'src/styles/global.css';

import { useEffect, useState } from "react";
import { Platform, StatusBar, View, Image } from 'react-native';
import {
  useFonts,
  HindSiliguri_400Regular,
  HindSiliguri_500Medium,
  HindSiliguri_700Bold
} from "@expo-google-fonts/hind-siliguri";
import { DefaultTheme, DarkTheme, ThemeProvider } from "@react-navigation/native";
import 'react-native-gesture-handler';

import { Provider } from 'react-redux';
import store from './src/store';

import RootStack from 'src/routes/index';
import { Loading } from "~/components/ui/Loading";
import { colors, setAppTheme } from '~/styles/colors';
import { ThemeProviderApp, useTheme } from './src/contexts/ThemeContext';

import * as NavigationBar from 'expo-navigation-bar';
import { Asset } from 'expo-asset';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import getToastConfig from './src/styles/toast';


// ======================
// APP ROOT
// ======================
export default function App() {
  const [loaded, error] = useFonts({
    HindSiliguri_400Regular,
    HindSiliguri_500Medium,
    HindSiliguri_700Bold
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // Preload static images (cover) to avoid delay when Home mounts
    (async () => {
      try {
        await Asset.loadAsync(require('src/assets/global/cover.png'));
      } catch (e) {
        // ignore
      } finally {
        setAssetsLoaded(true);
      }
    })();
  }, []);

  if (!loaded || !assetsLoaded) {
    return <Loading />;
  }

  // 🔥 SafeAreaProvider TEM que estar AQUI
  return (
    <SafeAreaProvider>
      <ThemeProviderApp>
        <RootLayoutNav />
      </ThemeProviderApp>
    </SafeAreaProvider>
  );
}


// ======================
// LAYOUT
// ======================
function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // update global colors module
    setAppTheme(theme === 'dark' ? 'dark' : 'light');

    if (Platform.OS === 'android') {
      // Apenas setButtonStyleAsync é suportado com edge-to-edge mode
      NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme]);
  return (
    <>
      <Provider store={store}>
        <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              paddingTop: insets.top,
              paddingBottom: insets.bottom
            }}
          >
            <StatusBar
              barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
              translucent={Platform.OS === 'android'}
              backgroundColor="transparent"
            />

            <RootStack key={theme} />
          </View>
        </ThemeProvider>
      </Provider>

      <Toast 
        config={getToastConfig(isDark)} 
        topOffset={120}
      />
    </>
  );
}
