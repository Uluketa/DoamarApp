import React from 'react';
import { View, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '~/types/navigation';
import { colors } from '~/styles/colors';
import { persistor } from '~/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { RESET_STATE } from '~/store/modules/user/actions';

const Header: React.FC = () => {
    const dispatch = useDispatch();

    const confirmLogout = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que deseja se desconectar?",
            [
                { text: "Cancelar", onPress: () => null, style: "cancel" },
                { text: "Sim", onPress: handleLogout }
            ]
        );
    };

    const handleLogout = async () => {
        try {
            await dispatch({ type: RESET_STATE });

            await persistor.purge();
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Erro ao limpar dados durante o logout:', error);
        }
    };

    return (
        <View style={{ backgroundColor: colors.palette[1] }} className="flex-row items-center justify-between px-3 py-4 absolute top-0 left-0 right-0">
            <Image
                source={require('~/assets/logoLightGreenB.png')}
                className="w-10 h-10 mx-2"
                resizeMode="contain"
            />
            <TextInput
                className="flex-1 h-10 bg-gray-200 rounded-lg px-4 mx-2 text-base text-gray-700"
                placeholder="Pesquisar..."
                placeholderTextColor="#666"
            />
            <TouchableOpacity onPress={confirmLogout} className='mx-2'>
                <MaterialIcons name="logout" size={25} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default Header;
