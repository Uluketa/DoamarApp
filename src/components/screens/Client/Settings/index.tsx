import React from 'react';
import { View, Text, Linking } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/types/Navigation';
import { version } from '../../../../../package.json';

import SettingsButton from './components/SettingsButton';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import * as userReducer from '~/store/modules/user/reducer';
import * as navReducer from '~/store/modules/navigation/reducer';
import * as cartReducer from '~/store/modules/cart/reducer';
import { persistor } from '~/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const email = 'doamarapp@gmail.com';
    const title = 'Ajuda - Doamar App';
    const body = 'Olá, preciso de ajuda com...';

    const sendEmail = () => {
        let url = `mailto:${email}`;

        const query: string[] = [];
        query.push(`subject=${encodeURIComponent(title)}`);
        query.push(`body=${encodeURIComponent(body)}`);
        
        if (query.length > 0) {
            url += `?${query.join('&')}`;
        }

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    console.log('Não foi possível abrir o email');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(err => console.error('Erro ao abrir email', err));
    };

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
            dispatch(userReducer.clearAll());
            dispatch(navReducer.clearAll());
            dispatch(cartReducer.clearAll());

            await persistor.purge();
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Erro ao limpar dados durante o logout:', error);
        }
    };

    return (
        <View className="flex-1 px-7 py-10 justify-between">
            <View>
                <Text className="text-2xl font-bold mb-5">Configurações</Text>

                {/* <SettingsButton iconName="settings" title="Editar Perfil" onPress={() => navigation.navigate('EditProfileClient')} /> */}
                <SettingsButton iconName="shield" title="Privacidade" onPress={() => navigation.navigate('Privacy')} />
                <SettingsButton iconName="help-circle" title="Ajuda" onPress={sendEmail} />
                <SettingsButton iconName="info" title="Sobre" onPress={() => navigation.navigate('About')} />
                <SettingsButton bbtm={false} iconName="log-out" title="Sair do App" color="red" onPress={confirmLogout} />  
            </View>

            <View>
                <Text className="text-center text-gray-400">Versão {version}</Text>
            </View>
        </View>
    );
};
