import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { useDispatch } from 'react-redux';
import { setUser } from '~/store/modules/user/actions';
import { setNavigationScreen } from '~/store/modules/navigation/actions';

import { RootStackParamList } from '~/types/Navigation';

import { colors } from '~/styles/colors';
import { styles } from './styles';

import { TextForgotPassword } from './components/TextForgotPassword';
import { LabeledTextInput } from '~/components/LabeledTextInput';
import { BtnText as ButtonEntrar } from '~/components/Button';

import Animated, { useSharedValue, withTiming, withSequence, withRepeat, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { authLogin } from '~/api';
import Toast from 'react-native-toast-message';

type SignInProps = { navigation: StackNavigationProp<RootStackParamList, 'SignIn'> };

export const SignIn = ({ navigation }: SignInProps) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [username, setUsername] = useState((__DEV__) ? 'cliente1' : '');
    const [password, setPassword] = useState((__DEV__) ? '1234' : '');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    // Valores compartilhados para animações
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const logoWidth = useSharedValue(100);
    const logoTranslateX = useSharedValue(0);
    const dispatch = useDispatch();

    useEffect(() => {
        logoOpacity.value = withTiming(1, { duration: 800 });
        logoScale.value = withTiming(1, { duration: 800 });

        const show = Keyboard.addListener('keyboardDidShow', () => {
            logoWidth.value = withTiming(70, { duration: 250 });
            logoTranslateX.value = withTiming(120, { duration: 250 });
        });

        const hide = Keyboard.addListener('keyboardDidHide', () => {
            logoWidth.value = withTiming(100, { duration: 250 });
            logoTranslateX.value = withTiming(0, { duration: 250 });
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    // Estilos animados
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        width: logoWidth.value,
        transform: [
            { scale: logoScale.value },
            { translateX: logoTranslateX.value }
        ],
    }));

    const handleLogin = async () => {
        setIsFetching(true);

        try {
            const responseUser = await authLogin({ username, password });

            if (responseUser.ok === "N") {
                Toast.show({
                    type: 'error',
                    text1: 'Ocorreu um erro!',
                    text2: responseUser.msg || 'Verifique os dados e tente novamente.'
                });

            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso!',
                    text2: responseUser.msg || 'Login realizado com sucesso.'
                });

                dispatch(setUser(responseUser.data));
                
                // Reset navegação de acordo com tipo de usuário
                const initialScreen = responseUser.data.type === 'institution' ? 'Dashboard' : 'Home';
                dispatch(setNavigationScreen({ screen: initialScreen }));
            }

        } catch (error: any) {
            Toast.show({
                type: 'warning',
                text1: 'Ocorreu um erro!',
                text2: error.msg || 'Tente novamente mais tarde.'
            });

        } finally {
            setIsFetching(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1 items-center'
            style={{ backgroundColor: colors.background }}
        >
            <View
                className='w-full justify-center'
                style={[styles.containerImg, styles.containerKeyNotVisible]}
            >
                <Animated.Image
                    source={require("~/assets/logoLightGreenB.png")}
                    style={[styles.imgKeyNotVisible, animatedStyle]}
                    resizeMode="contain"
                />
            </View>

            <View className='w-full h-[75%] justify-between'>
                <View className='w-full items-center justify-center p-8'>
                    <LabeledTextInput label="Login:" value={username} onChangeText={setUsername} />
                    <LabeledTextInput label="Senha:" value={password} onChangeText={setPassword} secureTextEntry />
                    <TextForgotPassword onPress={() => navigation.navigate('ForgotPassword')} />
                    <ButtonEntrar title='Entrar' onPress={handleLogin} bgColor={colors.primary} loading={isFetching} />
                </View>

                <View className='flex flex-row justify-center items-center '>
                    <Text className="text-base text-center mr-1 py-5" style={{ color: colors.text + '77' }}>Ainda não tem uma conta?</Text>
                    <TouchableOpacity className="items-center py-5"  onPress={() => navigation.navigate("SignUp")}>
                        <Text className='underline ml-1' style={{ color: colors.text }}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
