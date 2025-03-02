import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Alert, BackHandler, Text, View } from 'react-native';
import { Header } from '~/components/Client/Header';
import { NavBar } from '~/components/Navbar';

export default function Home() {
    const isFocused = useIsFocused();

    useEffect(() => {
        const handleBackPress = () => {
            if (isFocused) {
                Alert.alert(
                    "Atenção",
                    "Você realmente deseja sair do aplicativo?",
                    [
                        { text: "Cancelar", onPress: () => null, style: "cancel" },
                        { text: "Sair", onPress: () => BackHandler.exitApp() }
                    ]
                );
                return true;
            }
            return false;
        };

        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        };
    }, [isFocused]);

    return (
        <View className='flex-1 bg-green-300 items-center justify-center mb-0 pb-0'>
            <Header />
            <Text>Home</Text>
            <NavBar />
        </View>
    );
}
