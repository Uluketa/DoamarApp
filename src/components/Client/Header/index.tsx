import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, Image, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { persistor } from '~/store';
import { clearUser } from '~/store/modules/user/actions';
import { colors } from '~/styles/colors';

export const Header = () => {
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
            dispatch(clearUser());

            await persistor.purge();
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Erro ao limpar dados durante o logout:', error);
        }
    };

    return (
        <View style={{ backgroundColor: colors.palette[1] }} className="flex-row items-center justify-between px-3 py-4">
            <Image
                source={require('~/assets/logoLightGreenB.png')}
                className="w-10 h-10 mx-2"
                resizeMode="contain"
            />

            <View className="flex-row flex-1 items-center bg-gray-200 rounded-lg px-4 mx-2 h-10">
                <Ionicons name="search" size={20} color="#777" />
                <TextInput
                    className="flex-1 h-12 text-base text-gray-700 ml-2"
                    placeholder="Pesquisar..."
                    placeholderTextColor="#777"
                />
            </View>
            <TouchableOpacity onPress={confirmLogout} className='mx-2'>
                <MaterialIcons name="logout" size={25} color="white" />
            </TouchableOpacity>
        </View>
    );
};