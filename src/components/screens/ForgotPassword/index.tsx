import { useState } from 'react';
import { View, Text } from 'react-native';
import { BtnText } from '~/components/Button';
import { LabeledTextInput } from '~/components/LabeledTextInput';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '~/styles/colors';

export const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [emailEntered, setEmailEntered] = useState<boolean>(false);

    const handleContinue = () => {
        if (email.trim() !== '') {
            setEmailEntered(true);
        }
    };

    return (
        <View className='flex-1 items-center justify-center' style={{ backgroundColor: colors.background }}>
            <View className='w-96 rounded-2xl shadow-lg p-5' style={{ backgroundColor: colors.card }}>
                {!emailEntered ? (
                    <View className='p-2'>
                        <Text className='font-semibold text-xl' style={{ color: colors.text }}>Digite o seu e-mail para continuar: </Text>

                        <LabeledTextInput label="" onChangeText={setEmail} value={email} placeholder='example@email.com' required={false} />

                        <View className='mt-5'>
                            <BtnText bgColor={colors.primary} onPress={handleContinue} title='Continuar' />
                        </View>
                    </View>
                ) : (
                    <View className='p-4 items-center justify-center'>
                        <AntDesign name="check-circle" size={75} color={colors.palette[3]} className='mb-8' />
                        <Text className='font-semibold text-xl mb-2' style={{ color: colors.text }}>Mensagem de confirmação </Text>

                        <Text className='text-center text-sm mt-2' style={{ color: colors.text + '88' }}>Um e-mail de redefinição de senha foi enviado para {email}.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
