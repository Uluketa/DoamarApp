import { useState } from "react";
import { useColorScheme } from "react-native";

const [dark, setDark] = useState(false);

const colorScheme = useColorScheme();

if (colorScheme === 'dark') {
    if (!dark) setDark(true);
} else {
    if (dark) setDark(false);
}

export const theme = {
    backgroundColor: (dark) ? '#000000' : '#ffffff',
    textColor: (dark) ? '#ffffff' : '#000000'
};