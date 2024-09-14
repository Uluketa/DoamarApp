import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '~/components/Client/Header';
import NavBar from '~/components/Navbar';
import SettingsButton from './components/SettingsButton';

export default function Settings() {
    const navigation = useNavigation();

    const navigateTo = (screen: string) => {
        // navigation.navigate(screen);
    };

    return (
        <View className="flex-1 pt-20">
            <Header />
            <View className="flex-1 px-5 pt-5">
                <Text className="text-2xl font-bold mb-5">Configurações</Text>
                
                <SettingsButton title="Editar Perfil" onPress={() => navigateTo('EditProfile')} />
                <SettingsButton title="Privacidade" onPress={() => navigateTo('Privacy')} />
                <SettingsButton title="Ajuda" onPress={() => navigateTo('Help')} />
                <SettingsButton title="Sobre" onPress={() => navigateTo('About')} />
            </View>
            <NavBar />
        </View>
    );
};
