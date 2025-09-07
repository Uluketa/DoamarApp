import { useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '~/styles/colors';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/Navigation';
import { AntDesign } from '@expo/vector-icons';

import { LabeledTextInput } from '~/components/LabeledTextInput';
import { BtnText as ButtonCadastrar } from '~/components/Button';
import { TypeUser } from './components/TypeUser';
import { fetchCepData, saveSignUpData } from '~/api';
import Toast from 'react-native-toast-message';

type SignUpProps = { navigation: StackNavigationProp<RootStackParamList, 'SignUp'> };
type UserType = "C" | "I";

export const SignUp = ({ navigation }: SignUpProps) => {
    const [screen, setScreen] = useState<number>(1);

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [cpfCnpj, setCpfCnpj] = useState<string>('');
    const [cellphone, setCellphone] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userType, setTypeUser] = useState<UserType>('C');

    const [addressLine, setAddressLine] = useState<string>('');
    const [addressCep, setAddressCep] = useState<string>('');
    const [addressNumber, setAddressNumber] = useState<string>('');
    const [addressNeighborhood, setAddressNeighborhood] = useState<string>('');
    const [addressCity, setAddressCity] = useState<string>('');
    const [addressState, setAddressState] = useState<string>('SP');
    const [addressComplement, setAddressComplement] = useState<string>('');
    const [addressReference, setAddressReference] = useState<string>('');

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const onChangeCEP = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, "");
        setAddressCep(cleanCep);

        if (cleanCep.length === 8) {
            const resultado = await fetchCepData(cleanCep);

            if (resultado.ok === "S") {
                setAddressLine(resultado.logradouro || '');
                setAddressNeighborhood(resultado.bairro || '');
                setAddressCity(resultado.cidade || '');
                setAddressState(resultado.uf || '');
                setAddressComplement(resultado.complemento || '');
            }
        }
    }

    const handleSignUp = async () => {
        try {
            setIsLoading(true);

            const payload = {
                name,
                email,
                cellphone,
                addressLine,
                addressCep,
                addressNumber,
                addressNeighborhood,
                addressCity,
                addressState,
                addressComplement,
                addressReference,
                username,
                password,
                accountType: (userType === 'C' ? 'D' : 'R') as "D" | "R",
                cpf: (userType === 'C') ? cpfCnpj : undefined,
                cnpj: (userType === 'I') ? cpfCnpj : undefined,
                userType
            }

            const result = await saveSignUpData(payload);
            if (result.ok === 'S') {
                Toast.show({
                    type: 'success',
                    text1: 'Cadastrado com sucesso!',
                    text2: 'Agora, realize o login para entrar com a sua conta.'
                });
                navigation.navigate('SignIn');

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Ocorreu um erro!',
                    text2: result.msg || 'Verifique os dados e tente novamente.'
                });
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro!',
                text2: 'Erro ao cadastrar. Tente novamente mais tarde.'
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View className='flex-1 items-center justify-center'>
                <View className='justify-center items-center'
                    style={{
                        height: isKeyboardVisible ? '75%' : '90%',
                        paddingBottom: isKeyboardVisible ? 80 : 0
                    }}>
                    <View className='w-96 py-5 px-8 bg-white shadow-lg rounded-2xl'>
                        {(screen == 1) ? (
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                                <LabeledTextInput label="Nome:" value={name} onChangeText={setName} required />
                                <LabeledTextInput label="E-mail:" value={email} onChangeText={setEmail} placeholder='example@email.com' required />
                                <LabeledTextInput label="Celular:" value={cellphone} onChangeText={setCellphone} placeholder='11 98765-4321' required />
                                <LabeledTextInput label={(userType == "C") ? "CPF:" : "CNPJ:"} value={cpfCnpj} onChangeText={setCpfCnpj} required />

                                <Text className='mb-2 font-bold text-lg'>Tipo de Usuário: <Text style={{ color: 'red' }}>*</Text></Text>

                                <TypeUser setTypeUser={setTypeUser} userType={userType} />
                            </ScrollView>
                        ) : (
                            (screen == 2) ? (
                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                                    <LabeledTextInput label="CEP:" value={addressCep} onChangeText={onChangeCEP} placeholder='Ex: 00000-000' required />
                                    <LabeledTextInput label="Endereço:" value={addressLine} onChangeText={setAddressLine} placeholder='Ex: Rua Camucas do Sul' required />

                                    <View className='flex-row'>
                                        <View className='w-1/3 pr-1'>
                                            <LabeledTextInput label="Nº:" value={addressNumber} onChangeText={(value) => setAddressNumber(value)} placeholder='Ex: 1000' required />
                                        </View>

                                        <View className='w-2/3'>
                                            <LabeledTextInput label="Complemento:" value={addressComplement} onChangeText={setAddressComplement} />
                                        </View>
                                    </View>
                                </ScrollView>
                            ) : (screen == 3) ? (
                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                                    <LabeledTextInput label="Bairro:" value={addressNeighborhood} onChangeText={setAddressNeighborhood} placeholder='Ex: Centro' required />

                                    <View className='flex-row'>
                                        <View className='w-2/3 pr-1'>
                                            <LabeledTextInput label="Cidade:" value={addressCity} onChangeText={(value) => setAddressCity(value)} placeholder='Ex: São Paulo' required />
                                        </View>

                                        <View className='w-1/3'>
                                            <LabeledTextInput label="Estado (UF):" value={addressState} onChangeText={setAddressState} required />
                                        </View>
                                    </View>

                                    <LabeledTextInput label="Referência:" value={addressReference} onChangeText={setAddressReference} />
                                </ScrollView>
                            ) : (
                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                                    <LabeledTextInput label="Login:" value={username} onChangeText={setUsername} required />
                                    <LabeledTextInput label="Senha:" value={password} onChangeText={setPassword} required secureTextEntry />
                                </ScrollView>
                            )
                        )}

                        {(screen == 1) ? (
                            <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                                <View style={{ width: 24 }} />
                                <Text className='text-center text-gray-400'>{screen} / 4</Text>
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
                                    <Text className='text-center text-gray-400'>{screen} / 4</Text>
                                    <AntDesign
                                        name="arrowright"
                                        size={24}
                                        color={colors.palette[1]}
                                        onPress={() => setScreen(screen + 1)}
                                        className='p-2'
                                    />
                                </View>
                            ) : (screen == 3) ? (
                                <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                                    <AntDesign
                                        name="arrowleft"
                                        size={24}
                                        color={colors.palette[1]}
                                        onPress={() => setScreen(screen - 1)}
                                        className='p-2'
                                    />
                                    <Text className='text-center text-gray-400'>{screen} / 4</Text>
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
                                    <Text className='text-center text-gray-400'>{screen} / 4</Text>
                                    <View style={{ width: 24 }} />
                                </View>
                            )
                        )}
                    </View>

                    {(screen == 4) && (
                        <View className='w-96 px-14 mt-4'>
                            <Text className='text-center text-sm text-gray-400 mb-4'>Li e estou de acordo com os <Text className='underline'>Termos de Uso</Text>.</Text>
                            <ButtonCadastrar bgColor={colors.palette[1]} onPress={handleSignUp} title='Cadastrar-se' loading={isLoading} />
                        </View>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}