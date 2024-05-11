import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { styles } from './styles';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/routes';

import TextForgotPassword from './components/TextForgotPassword';
import LabeledTextInput from '~/components/LabeledTextInput';
import ButtonEntrar from '~/components/Button';
import { login } from '~/services/api';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SignIn'> };

export default function SignIn({ navigation }: Props) {
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [vlogin, setvLogin] = useState('');
    const [password, setPassword] = useState('');
    
    const [verror, setvError] = useState(false);
    const [verrorMsg, setvErrorMsg] = useState<string>();

    const handleLogin = async () => {
        const api = await login(vlogin, password);

        console.log(api)
        if (api.success) {
            if (api.typeUser === "I") {
                if (api.receiveDonationQuest) {
                    navigation.navigate('HomeCompany');
                } else {
                    navigation.navigate('ReceiveDonationQuest');
                }
            } else if (api.typeUser === "C") {
                navigation.navigate('HomeClient');
            } else {
                setvError(true);
            }
        } else {
            setvError(true);
            setvErrorMsg("Ops, ocorreu um erro. Tente novamente mais tarde");
        }
    };

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
                <LabeledTextInput label="Login:" value={vlogin} onChangeTxt={setvLogin} placeholder='' />
                <LabeledTextInput label="Senha:" value={password} onChangeTxt={setPassword} placeholder='' password/>
                <TextForgotPassword onPress={() => navigation.navigate('ForgotPassword')} />

                <ButtonEntrar title='Entrar' onPress={handleLogin} bgColor={colors.palette[1]} />
            </View>

            <View style={{ height: '10%' }} >
                <TouchableOpacity className="items-center p-5" onPress={() => navigation.navigate("SignUp")}>
                    <Text className="text-gray-500 text-base text-center">Ainda não tem uma conta? <Text style={{ textDecorationLine: 'underline' }}>Cadastre-se</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
