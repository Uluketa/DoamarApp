import { useEffect } from 'react';
import { View, Text, Alert, BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function HomeClient() {
    const isFocused = useIsFocused(); // Verifica se a tela está focada

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
        <View className='flex-1 bg-green-300 items-center mb-0 pb-0'>
        </View>
    );
}
