import { useEffect, useState } from 'react';
import { View, Text, Keyboard, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { colors } from '~/styles/colors';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/Navigation';
import { AntDesign } from '@expo/vector-icons';

import { LabeledTextInput } from '~/components/LabeledTextInput';
import { BtnText as ButtonCadastrar } from '~/components/Button';
import { TypeUser } from './components/TypeUser';
import { fetchCepData, listSocialIssues, saveSignUpData } from '~/api';
import Toast from 'react-native-toast-message';
import { SocialIssue } from '~/types/entities/SocialIssue';

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
    const [socialIssues, setSocialIssues] = useState<SocialIssue[]>([]);
    const [socialIssueId, setSocialIssueId] = useState<number | null>(null);
    const [isSocialIssueModalOpen, setSocialIssueModalOpen] = useState(false);
    const [isSocialIssueLoading, setSocialIssueLoading] = useState(false);

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

    const stripNonDigits = (value: string) => value.replace(/\D/g, '');

    const formatCpfCnpj = (value: string, type: UserType) => {
        const maxDigits = type === 'C' ? 11 : 14;
        const digits = stripNonDigits(value).slice(0, maxDigits);

        if (type === 'C') {
            const part1 = digits.slice(0, 3);
            const part2 = digits.slice(3, 6);
            const part3 = digits.slice(6, 9);
            const part4 = digits.slice(9, 11);

            return [
                part1,
                part2 ? `.${part2}` : '',
                part3 ? `.${part3}` : '',
                part4 ? `-${part4}` : ''
            ].join('');
        }

        const part1 = digits.slice(0, 2);
        const part2 = digits.slice(2, 5);
        const part3 = digits.slice(5, 8);
        const part4 = digits.slice(8, 12);
        const part5 = digits.slice(12, 14);

        return [
            part1,
            part2 ? `.${part2}` : '',
            part3 ? `.${part3}` : '',
            part4 ? `/${part4}` : '',
            part5 ? `-${part5}` : ''
        ].join('');
    };

    const formatPhone = (value: string) => {
        const digits = stripNonDigits(value).slice(0, 11);
        const ddd = digits.slice(0, 2);
        const rest = digits.slice(2);

        if (rest.length <= 4) {
            return ddd ? `(${ddd}) ${rest}`.trim() : rest;
        }

        if (rest.length <= 8) {
            const part1 = rest.slice(0, 4);
            const part2 = rest.slice(4);
            return `(${ddd}) ${part1}-${part2}`.trim();
        }

        const part1 = rest.slice(0, 5);
        const part2 = rest.slice(5);
        return `(${ddd}) ${part1}-${part2}`.trim();
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (!cpfCnpj) {
            return;
        }

        setCpfCnpj(formatCpfCnpj(cpfCnpj, userType));
    }, [userType]);

    useEffect(() => {
        if (userType === 'C') {
            setSocialIssueId(null);
        }
    }, [userType]);

    const loadSocialIssues = async () => {
        if (socialIssues.length > 0 || isSocialIssueLoading) {
            return;
        }

        setSocialIssueLoading(true);
        try {
            const response = await listSocialIssues();
            if (response.ok === 'S' && response.data) {
                setSocialIssues(response.data);
            }
        } finally {
            setSocialIssueLoading(false);
        }
    };

    const onChangeCEP = async (cep: string) => {
        const cleanCep = stripNonDigits(cep);
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

            if (userType === 'I' && !socialIssueId) {
                Toast.show({
                    type: 'error',
                    text1: 'Ocorreu um erro!',
                    text2: 'Selecione uma causa social.'
                });
                setIsLoading(false);
                return;
            }

            if (password.trim().length <= 4) {
                Toast.show({
                    type: 'error',
                    text1: 'Ocorreu um erro!',
                    text2: 'A senha precisa ter mais de 4 digitos.'
                });
                setIsLoading(false);
                return;
            }

            const cleanCpfCnpj = stripNonDigits(cpfCnpj);
            const cleanCellphone = stripNonDigits(cellphone);

            const payload = {
                name,
                email,
                cellphone: cleanCellphone,
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
                cpf: (userType === 'C') ? cleanCpfCnpj : undefined,
                cnpj: (userType === 'I') ? cleanCpfCnpj : undefined,
                social_issue_id: (userType === 'I') ? socialIssueId ?? undefined : undefined,
                userType
            }

            console.log("Payload for sign-up:", payload);

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

            setIsLoading(false);

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro!',
                text2: 'Erro ao cadastrar. Tente novamente mais tarde.'
            });
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: colors.background }}
        >
            <View className='flex-1 items-center justify-center'>
                <View className='justify-center items-center'
                    style={{
                        height: isKeyboardVisible ? '75%' : '90%',
                        paddingBottom: isKeyboardVisible ? 80 : 0
                    }}>
                    <View className='w-96 py-5 px-8 shadow-lg rounded-2xl' style={{ backgroundColor: colors.card }}>
                        {(screen == 1) ? (
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                                <LabeledTextInput label="Nome:" value={name} onChangeText={setName} required placeholder='Lucas Miguel | ONG Vida' />
                                <LabeledTextInput label="E-mail:" value={email} onChangeText={setEmail} placeholder='example@email.com' required />
                                <LabeledTextInput label="Celular:" value={cellphone} onChangeText={(value) => setCellphone(formatPhone(value))} placeholder='11 98765-4321' required />
                                <LabeledTextInput label={(userType == "C") ? "CPF:" : "CNPJ:"} value={cpfCnpj} onChangeText={(value) => setCpfCnpj(formatCpfCnpj(value, userType))} placeholder='12345678910' required />

                                {userType === 'I' && (
                                    <View className='mb-4'>
                                        <Text className='mb-2 font-bold text-lg' style={{ color: colors.text }}>
                                            Causa Social: <Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSocialIssueModalOpen(true);
                                                loadSocialIssues();
                                            }}
                                            className='px-3 py-3 rounded-xl border'
                                            style={{ borderColor: colors.border, backgroundColor: colors.background }}
                                        >
                                            <Text style={{ color: colors.text }}>
                                                {socialIssues.find((issue) => issue.id === socialIssueId)?.title || 'Selecione uma causa social'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <Text className='mb-2 font-bold text-lg' style={{ color: colors.text }}>Tipo de Usuário: <Text style={{ color: 'red' }}>*</Text></Text>

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
                                            <LabeledTextInput label="UF:" value={addressState} onChangeText={setAddressState} required />
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
                                    name="arrow-right"
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
                                        name="arrow-left"
                                        size={24}
                                        color={colors.palette[1]}
                                        onPress={() => setScreen(screen - 1)}
                                        className='p-2'
                                    />
                                    <Text className='text-center text-gray-400'>{screen} / 4</Text>
                                    <AntDesign
                                        name="arrow-right"
                                        size={24}
                                        color={colors.palette[1]}
                                        onPress={() => setScreen(screen + 1)}
                                        className='p-2'
                                    />
                                </View>
                            ) : (screen == 3) ? (
                                <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                                    <AntDesign
                                        name="arrow-left"
                                        size={24}
                                        color={colors.palette[1]}
                                        onPress={() => setScreen(screen - 1)}
                                        className='p-2'
                                    />
                                    <Text className='text-center text-gray-400'>{screen} / 4</Text>
                                    <AntDesign
                                        name="arrow-right"
                                        size={24}
                                        color={colors.palette[1]}
                                        onPress={() => setScreen(screen + 1)}
                                        className='p-2'
                                    />
                                </View>
                            ) : (
                                <View className='w-full grid-cols-3 flex-row justify-between mt-3 items-center'>
                                    <AntDesign
                                        name="arrow-left"
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
                            <ButtonCadastrar bgColor={colors.primary} onPress={handleSignUp} title='Cadastrar-se' loading={isLoading} />
                        </View>
                    )}
                </View>
            </View>

            <Modal visible={isSocialIssueModalOpen} transparent animationType="fade" onRequestClose={() => setSocialIssueModalOpen(false)}>
                <View className='flex-1 items-center justify-center bg-black/60 px-8'>
                    <View className='w-full rounded-2xl p-6' style={{ backgroundColor: colors.card }}>
                        <Text className='text-lg font-bold mb-4' style={{ color: colors.text }}>
                            Selecione a causa social
                        </Text>

                        {isSocialIssueLoading ? (
                            <View className='py-8 items-center'>
                                <ActivityIndicator color={colors.primary} />
                            </View>
                        ) : (
                            <ScrollView className='max-h-80'>
                                {socialIssues.map((issue) => (
                                    <TouchableOpacity
                                        key={issue.id}
                                        onPress={() => {
                                            setSocialIssueId(issue.id);
                                            setSocialIssueModalOpen(false);
                                        }}
                                        className='py-3 border-b'
                                        style={{ borderColor: colors.border }}
                                    >
                                        <Text style={{ color: colors.text }}>{issue.title}</Text>
                                        <Text className='text-xs mt-1' style={{ color: colors.text + 'AA' }}>{issue.description}</Text>
                                    </TouchableOpacity>
                                ))}
                                {socialIssues.length === 0 && (
                                    <Text style={{ color: colors.text }}>Nenhuma causa encontrada.</Text>
                                )}
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            className='py-3 rounded-xl border mt-4'
                            style={{ borderColor: colors.border }}
                            onPress={() => setSocialIssueModalOpen(false)}
                        >
                            <Text className='text-center font-semibold' style={{ color: colors.text }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}