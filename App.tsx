import 'src/styles/global.css';

import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useFonts, HindSiliguri_400Regular, HindSiliguri_500Medium, HindSiliguri_700Bold } from "@expo-google-fonts/hind-siliguri";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import 'react-native-gesture-handler';

import RootStack from 'src/routes/index';
import { Loading } from "src/components/global/loading";

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
    const colorScheme = useColorScheme();
    
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootStack />
        </ThemeProvider>
    );
}
