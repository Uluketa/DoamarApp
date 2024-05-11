import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Keyboard, StyleSheet, ScrollView } from 'react-native';
import { colors } from '~/styles/colors';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/routes';
import { AntDesign } from '@expo/vector-icons';

import LabeledTextInput from '~/components/LabeledTextInput';
import ButtonCadastrar from '~/components/Button';
import TypeUserSelect from './components/TypeUser';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'SignUp'> };
type UserType = "C" | "I";

export default function SignUp({ navigation }: Props) {
    const [screen, setScreen] = useState(1);

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [cpfCnpj, setCpfCnpj] = useState<string>('');
    const [cel, setCel] = useState<string>('');
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [typeUser, setTypeUser] = useState<UserType>('I');

    const [address, setAddress] = useState<string>('');
    const [addressCep, setAddressCep] = useState<string>('');
    const [addressNum, setAddressNum] = useState<string>(0);
    const [addressCompl, setAddressCompl] = useState<string>('');
    const [addressRefer, setAddressRefer] = useState<string>('');

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
            <View className='justify-center items-center' style={{ height: '90%' }}>
                <View className='w-96 py-5 px-8 bg-white shadow-lg rounded-2xl' style={{ maxHeight: (isKeyboardVisible) ? '80%' : 'auto' }}>
                    {(screen == 1) ? (
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <LabeledTextInput label="Nome:" value={name} onChangeTxt={setName} placeholder='' required />
                            <LabeledTextInput label="E-mail:" value={email} onChangeTxt={setEmail} placeholder='example@email.com' required />
                            <LabeledTextInput label="Celular:" value={cel} onChangeTxt={setCel} placeholder='11 98765-4321' required />
                            <LabeledTextInput label="CPF / CNPJ:" value={cpfCnpj} onChangeTxt={setCpfCnpj} placeholder='' required />

                            <Text className='mb-2 font-bold text-lg'>Tipo de Usuário: <Text style={{ color: 'red' }}>*</Text></Text>

                            <TypeUserSelect setTypeUser={setTypeUser} typeUser={typeUser} />
                        </ScrollView>
                    ) : (
                        (screen == 2) ? (
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                <LabeledTextInput label="CEP:" value={addressCep} onChangeTxt={setAddressCep} placeholder='Ex: 00000-000' required />
                                <LabeledTextInput label="Endereço:" value={address} onChangeTxt={setAddress} placeholder='Ex: Rua Camucas do Sul' required />

                                <View className='flex-row'>
                                    <View className='w-1/3 pr-1'>
                                        <LabeledTextInput label="Nº:" value={addressNum} onChangeTxt={setAddressNum} placeholder='Ex: 1000' required />
                                    </View>
                                    <View className='w-2/3'>
                                        <LabeledTextInput label="Complemento:" value={addressCompl} onChangeTxt={setAddressCompl} placeholder='' />
                                    </View>
                                </View>

                                <LabeledTextInput label="Referência:" value={addressRefer} onChangeTxt={setAddressRefer} placeholder='' />
                            </ScrollView>
                        ) : (
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                <LabeledTextInput label="Login:" value={login} onChangeTxt={setLogin} placeholder='' required />
                                <LabeledTextInput label="Senha:" value={password} onChangeTxt={setPassword} placeholder='' required password />
                            </ScrollView>
                        )
                    )}

                    {(screen == 1) ? (
                        <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                            <View style={{ width: 24 }} />
                            <Text className='text-center text-gray-400'>{screen} / 3</Text>
                            <AntDesign
                                name="arrowright"
                                size={24}
                                color={colors.palette[1]}
                                onPress={() => setScreen(screen + 1)}
                                className='p-2'
                            />
                        </View>
                    ) : (
                        (screen == 2) ? (
                            <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                                <AntDesign
                                    name="arrowleft"
                                    size={24}
                                    color={colors.palette[1]}
                                    onPress={() => setScreen(screen - 1)}
                                    className='p-2'
                                />
                                <Text className='text-center text-gray-400'>{screen} / 3</Text>
                                <AntDesign
                                    name="arrowright"
                                    size={24}
                                    color={colors.palette[1]}
                                    onPress={() => setScreen(screen + 1)}
                                    className='p-2'
                                />
                            </View>
                        ) : (
                            <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                                <AntDesign
                                    name="arrowleft"
                                    size={24}
                                    color={colors.palette[1]}
                                    onPress={() => setScreen(screen - 1)}
                                    className='p-2'
                                />
                                <Text className='text-center text-gray-400'>{screen} / 3</Text>
                                <View style={{ width: 24 }} />
                            </View>
                        )
                    )}

                </View>

                {(screen == 3) && (
                    <View className='w-96 px-14 mt-4'>
                        <Text className='text-center text-sm text-gray-400 mb-4'>Li e estou de acordo com os <Text style={{ textDecorationLine: 'underline' }}>Termos de Uso</Text>.</Text>
                        <ButtonCadastrar bgColor={colors.palette[1]} onPress={() => navigation.navigate("SignIn")} title='Cadastrar-se' />
                    </View>
                )}
            </View>
        </View >
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
