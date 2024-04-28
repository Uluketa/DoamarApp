import { useEffect, useState } from 'react';
import { View, Text, TextInput, ColorSchemeName, TouchableOpacity, Image, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';

import TextForgotPassword from './components/TextForgotPassword';
import LabeledTextInput from '~/components/LabeledTextInput';
import ButtonEntrar from '~/components/Button';

import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/routes';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SignIn'> };

export default function SignIn({ navigation }: Props) {
    const [auth, setAuth] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    return (
        <View className='flex-1 items-center justify-center'>
            <View
                className='w-full justify-center'
                style={[styles.containerImg, (isKeyboardVisible) ? styles.containerKeyVisible : styles.containerKeyNotVisible]}
            >
                <Image
                    source={require("../../assets/logoLightGreenB.png")}
                    style={(isKeyboardVisible) ? styles.imgKeyVisible : styles.imgKeyNotVisible}
                />
            </View>

            <View
                className='w-full items-center justify-center px-8'
                style={{ height: '65%' }}
            >
                <LabeledTextInput label="Login:" value={login} onChangeTxt={setLogin}/>
                <LabeledTextInput label="Senha:" value={password} onChangeTxt={setPassword}/>
                <TextForgotPassword onPress={() => navigation.navigate('ForgotPassword')} />

                <ButtonEntrar title='Entrar' onPress={() => navigation.navigate('HomeClient')} bgColor={colors.palette[1]} />
            </View>

            <View
                style={{ height: '10%' }}
            >
                <TouchableOpacity className="items-center p-5" >
                    <Text className="text-gray-500 text-base text-center">Ainda não tem uma conta? <Text style={{ textDecorationLine: 'underline' }}>Cadastre-se</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imgKeyVisible: {
        width: 50,
        height: 50
    },
    imgKeyNotVisible: {
        width: 100,
        height: 100
    },
    containerKeyVisible: {
        alignItems: 'flex-end',
        paddingRight: 20
    },
    containerKeyNotVisible: {
        alignItems: 'center'
    },
    containerImg: {
        backgroundColor: colors.palette[1],
        height: '25%'
    }
});
