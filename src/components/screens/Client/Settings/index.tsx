import React, { useState } from 'react';
import { View, Text, Linking, Alert, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/types/Navigation';
import { version } from '../../../../../package.json';

import SettingsButton from '~/components/SettingsButton';
import { useTheme } from '~/contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '~/store';
import { RootState } from '~/store';
import { clearUser } from '~/store/modules/user/actions';
import { clearCart } from '~/store/modules/cart/actions';
import { resetNavigation } from '~/store/modules/navigation/actions';
import { clearHome } from '~/store/modules/home/actions';
import { authLogout } from '~/api';
import colors from '~/styles/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.user);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
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
                    console.log('Não foi possível abrir o email');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(err => console.error('Erro ao abrir email', err));
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Tentar fazer logout no servidor (não é crítico se falhar)
            if (token) {
                await authLogout(token);
            }

            // Limpar Redux
            dispatch(clearUser());
            dispatch(clearCart());
            dispatch(resetNavigation());
            dispatch(clearHome());

            // Limpar AsyncStorage e Redux Persist
            await persistor.purge();
            await AsyncStorage.clear();

            // Redirecionar para login
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }]
            });

        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo em caso de erro, vamos limpar dados locais
            dispatch(clearUser());
            dispatch(clearCart());
            dispatch(resetNavigation());
            dispatch(clearHome());
            await AsyncStorage.clear();
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }]
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

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

    return (
        <View className='flex-1 py-6' style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center mx-6 mb-4">
                <Ionicons name="settings" size={28} color={colors.palette[1]} />
                <Text className="text-2xl font-bold ml-3" style={{ color: colors.text }}>
                    Configurações
                </Text>
            </View>
            <View className="flex-1 px-7 pb-10 justify-between">
                <View>
                    {/* Theme toggle */}
                    <SettingsButton
                        iconName={theme === 'dark' ? 'sunny-outline' : 'moon-outline' as any}
                        title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                        color={colors.text}
                        onPress={toggleTheme}
                    />

                    <SettingsButton
                        iconName="person-outline"
                        title="Editar Perfil"
                        color={colors.text}
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <SettingsButton
                        iconName="shield-checkmark-outline"
                        title="Privacidade"
                        color={colors.text}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    />
                    <SettingsButton
                        iconName="help-circle-outline"
                        title="Ajuda"
                        color={colors.text}
                        onPress={sendEmail}
                    />
                    <SettingsButton
                        iconName="information-circle-outline"
                        title="Sobre"
                        color={colors.text}
                        onPress={() => navigation.navigate('About')}
                    />

                    {isLoggingOut ? (
                        <View className="mt-4 flex-row items-center justify-center py-3 border border-red-200 rounded-lg">
                            <ActivityIndicator color="red" size="small" />
                            <Text className="ml-2 text-red-600 font-semibold">Desconectando...</Text>
                        </View>
                    ) : (
                        <SettingsButton
                            bbtm={false}
                            iconName="log-out-outline"
                            title="Sair do App"
                            color="red"
                            onPress={confirmLogout}
                        />
                    )}
                </View>

                <View>
                    <Text className="text-center text-gray-400">Versão {version}</Text>
                </View>
            </View>
        </View>
    );
}
