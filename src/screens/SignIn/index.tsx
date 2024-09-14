import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store/modules/rootReducer';
import { LOGIN_REQUEST, LOGIN_SUCCESS } from '~/store/modules/user/actions';

import { RootStackParamList } from '~/routes';
import { login } from '~/services/api';

import { colors } from '~/styles/colors';
import { styles } from './styles';

import { TextForgotPassword } from './components/TextForgotPassword';
import { LabeledTextInput } from '~/components/LabeledTextInput';
import { BtnText as ButtonEntrar } from '~/components/Button';
import { ModalError } from '~/components/ModalError';

import Animated, { useSharedValue, withTiming, withSequence, withRepeat, withSpring, useAnimatedStyle } from 'react-native-reanimated';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SignIn'> };

export default function SignIn({ navigation }: Props) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [vlogin, setvLogin] = useState((__DEV__) ? 'cliente1' : '');
    const [password, setPassword] = useState((__DEV__) ? '1234' : '');

    const [verror, setvError] = useState(false);
    const [verrorMsg, setvErrorMsg] = useState<string>();

    // Valores compartilhados para animações
    const logoScale = useSharedValue(0.5);
    const logoOpacity = useSharedValue(0);
    const logoWidth = useSharedValue(100);
    const logoMarginLeft = useSharedValue(0);

    const dispatch = useDispatch();

    useEffect(() => {
        // Animações iniciais
        logoOpacity.value = withTiming(1, { duration: 2000 });
        logoScale.value = withSequence(
            withTiming(1, { duration: 1000 }),
            withRepeat(
                withSpring(1.1, {
                    damping: 50,
                    stiffness: 50,
                    mass: 2
                }),
                4,
                true
            )
        );

        // Listeners para teclado
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
            logoWidth.value = withTiming(70, { duration: 300 });
            logoMarginLeft.value = withTiming(1, { duration: 300 });
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            logoWidth.value = withTiming(100, { duration: 300 });
            logoMarginLeft.value = withTiming(0, { duration: 300 });
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [logoOpacity, logoScale, logoWidth, logoMarginLeft]);

    // Estilos animados
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: logoOpacity.value,
            transform: [{ scale: logoScale.value }],
            width: logoWidth.value,
            marginLeft: isKeyboardVisible ? 'auto' : logoMarginLeft.value,
        };
    });

    const handleLogin = async () => {
        await dispatch({
            type: LOGIN_REQUEST,
            payload: {
                login: vlogin,
                password: password,
            },
        });

        console.log('response')
    };

    return (
        <View className='flex-1 items-center justify-center'>
            <ModalError visible={verror}><Text>{verrorMsg}</Text></ModalError>

            <View
                className='w-full justify-center'
                style={[styles.containerImg, (isKeyboardVisible) ? styles.containerKeyVisible : styles.containerKeyNotVisible]}
            >
                <Animated.Image
                    source={require("../../assets/logoLightGreenB.png")}
                    style={[styles.imgKeyNotVisible, animatedStyle]}
                    resizeMode="contain"
                />
            </View>

            <View className='w-full items-center justify-center px-8' style={{ height: '65%' }}>
                <LabeledTextInput label="Login:" value={vlogin} onChangeText={setvLogin} />
                <LabeledTextInput label="Senha:" value={password} onChangeText={setPassword} secureTextEntry />
                <TextForgotPassword onPress={() => navigation.navigate('ForgotPassword')} />

                <ButtonEntrar title='Entrar' onPress={handleLogin} bgColor={colors.palette[1]} />
            </View>

            <View className='flex flex-row' style={{ height: '10%' }} >
                <Text className="text-gray-500 text-base text-center mr-1 py-5">Ainda não tem uma conta?</Text>

                <TouchableOpacity className="items-center py-5" onPress={() => navigation.navigate("SignUp")}>
                    <Text className='underline ml-1'>Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}
