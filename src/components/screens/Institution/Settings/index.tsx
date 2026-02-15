import React from 'react';
import { View, Text, Linking, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { version } from '../../../../../package.json';

import SettingsButton from '~/components/SettingsButton';
import { RootStackParamList } from '~/types/Navigation';
import { useTheme } from '~/contexts/ThemeContext';
import colors from '~/styles/colors';

export default function InstitutionSettings() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme, toggleTheme } = useTheme();

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
                    Alert.alert('Erro', 'Não foi possível abrir o email.');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(() => Alert.alert('Erro', 'Erro ao abrir email.'));
    };

    return (
        <View className='flex-1 justify-between py-6' style={{ backgroundColor: colors.background }}>
            <View className="flex-1 px-7 pb-10">
                <SettingsButton
                    iconName={theme === 'dark' ? 'sunny-outline' : 'moon-outline' as any}
                    title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                    color={colors.text}
                    onPress={toggleTheme}
                />

                <SettingsButton
                    iconName="business-outline"
                    title="Editar informações da instituição"
                    color={colors.text}
                    onPress={() => navigation.navigate('EditInstitutionProfile')}
                />

                <SettingsButton
                    iconName="help-circle-outline"
                    title="Entre em contato"
                    color={colors.text}
                    onPress={sendEmail}
                />

                <SettingsButton
                    iconName="information-circle-outline"
                    title="Sobre"
                    color={colors.text}
                    onPress={() => navigation.navigate('About')}
                    bbtm={false}
                />
            </View>
            <View className="items-center py-6" >
                <Text className='text-sm' style={{ color: colors.secondary }}>Versão {version}</Text>
            </View>
        </View>
    );
}
