import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppTheme as setGlobalAppTheme, getAppTheme as getGlobalAppTheme } from '~/styles/colors';

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (t: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

export const ThemeProviderApp = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('@app_theme');
        const t = (stored === 'dark') ? 'dark' : 'light';
        setThemeState(t);
        setGlobalAppTheme(t);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const setTheme = async (t: ThemeType) => {
    setThemeState(t);
    setGlobalAppTheme(t);
    try {
      await AsyncStorage.setItem('@app_theme', t);
    } catch (e) {}
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
