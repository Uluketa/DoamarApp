import { useEffect, useState } from 'react';
import { View, Text, TextInput, ColorSchemeName, TouchableOpacity, Image, Keyboard, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { colors } from '~/styles/colors';

import LabeledTextInput from '~/components/LabeledTextInput';
import ButtonEntrar from '~/components/Button';

import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/routes';
import { AntDesign } from '@expo/vector-icons';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SignUp'> };
type UserType = "Client" | "Institution";

export default function SignUp({ navigation }: Props) {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [cpfCnpj, setCpfCnpj] = useState<string>('');
    const [cel, setCel] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [typeUser, setTypeUser] = useState<UserType>('Client');

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', () => { setKeyboardVisible(true) }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide', () => { setKeyboardVisible(false) }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View className='flex-1 items-center justify-center'>
            <View
                className='w-full flex-row items-center'
                style={[styles.containerImgLogo, { height: (isKeyboardVisible) ? 10 : '10%' }]}
            >
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                    <AntDesign name="arrowleft" size={24} color={colors.palette[2]} style={{ marginRight: 10 }} />
                </TouchableOpacity>

                <Image
                    source={require("../../assets/logoLightGreenB.png")}
                    style={[styles.imgLogo, { display: (isKeyboardVisible) ? 'none' : 'flex' }]}
                />
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ height: (isKeyboardVisible) ? '90%' : '80%' }}
                className='w-full px-8 my-11'
            >
                <View style={{ paddingVertical: 20 }}>
                    <LabeledTextInput label="Nome:" value={name} onChangeTxt={setName} placeholder='' required />
                    <LabeledTextInput label="E-mail:" value={email} onChangeTxt={setEmail} placeholder='example@email.com' required />
                    <LabeledTextInput label="Celular:" value={cel} onChangeTxt={setCel} placeholder='11 98765-4321' required />
                    <LabeledTextInput label="CPF / CNPJ:" value={cpfCnpj} onChangeTxt={setCpfCnpj} placeholder='' required />
                    <LabeledTextInput label="Login:" value={login} onChangeTxt={setLogin} placeholder='' required />
                    <LabeledTextInput label="Senha:" value={password} onChangeTxt={setPassword} placeholder='' required />
                </View>
            </ScrollView>

            <View className='px-8 w-full' style={{ height: '10%' }}>
                <ButtonEntrar title='Entrar' onPress={() => navigation.navigate('HomeClient')} bgColor={colors.palette[1]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imgLogo: {
        width: 50,
        height: 50
    },
    containerImgLogo: {
        backgroundColor: colors.palette[1],
        justifyContent: 'space-between',
        paddingHorizontal: 20
    }
});
