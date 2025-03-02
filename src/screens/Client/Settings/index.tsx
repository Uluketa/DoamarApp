import React from 'react';
import { View, Text } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/types/navigation';
import { version } from '../../../../package.json';

import SettingsButton from './components/SettingsButton';
import {Header} from '~/components/Client/Header';
import {NavBar} from '~/components/Navbar';

export default function Settings() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const navigateTo = (screen: string) => {
    };

    return (
        <View className="flex-1 pt-20">
            <Header />
            <View className="flex-1 px-5 pt-5 pb-[25%] justify-between">
                <View>
                    <Text className="text-2xl font-bold mb-5">Configurações</Text>

                    <SettingsButton iconName="settings" title="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />
                    <SettingsButton iconName="shield" title="Privacidade" onPress={() => navigation.navigate('Privacy')} />
                    <SettingsButton iconName="help-circle" title="Ajuda" onPress={() => navigation.navigate('Help')} />
                    <SettingsButton bbtm={false} iconName="info" title="Sobre" onPress={() => navigation.navigate('About')} />
                </View>

                <View>
                    <Text className="text-center text-gray-400">Versão {version}</Text>
                </View>
            </View>

            <NavBar />
        </View>
    );
};
