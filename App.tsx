import 'src/styles/global.css';

import { useEffect, useState } from "react";
import { colorScheme } from 'nativewind';
import { useFonts, HindSiliguri_400Regular, HindSiliguri_500Medium, HindSiliguri_700Bold } from "@expo-google-fonts/hind-siliguri";
import { DefaultTheme, DarkTheme, ThemeProvider } from "@react-navigation/native";
import 'react-native-gesture-handler';

import { Provider } from 'react-redux';
import store from './src/store';

import RootStack from 'src/routes/index';
import { Loading } from "~/components/ui/Loading";
import { StatusBar } from 'react-native';
import { colors } from '~/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [colorTheme, setColorTheme] = useState(colorScheme.get());

  return (
    <Provider store={store}>
      <ThemeProvider value={colorTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaView className='flex-1' style={{ backgroundColor: colors.palette[1] }}>
          <StatusBar backgroundColor={colors.palette[1]} />
          <RootStack />
        </SafeAreaView>
      </ThemeProvider>
    </Provider>
  );
}
