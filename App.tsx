import 'src/styles/global.css';

import { useEffect } from "react";
import { Platform, StatusBar, View } from 'react-native';
import {
  useFonts,
  HindSiliguri_400Regular,
  HindSiliguri_500Medium,
  HindSiliguri_700Bold
} from "@expo-google-fonts/hind-siliguri";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import 'react-native-gesture-handler';

import { Provider } from 'react-redux';
import store from './src/store';

import RootStack from 'src/routes/index';
import { Loading } from "~/components/ui/Loading";
import { colors } from '~/styles/colors';

import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


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

  if (!loaded) {
    return <Loading />;
  }

  // 🔥 SafeAreaProvider TEM que estar AQUI
  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}


// ======================
// LAYOUT
// ======================
function RootLayoutNav() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colors.background);
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.palette[1],
            paddingTop: insets.top,
            paddingBottom: 0
          }}
        >
          <StatusBar
            barStyle="dark-content"
            translucent={Platform.OS === 'android'}
            backgroundColor="transparent"
          />

          <RootStack />
        </View>
      </ThemeProvider>
    </Provider>
  );
}
