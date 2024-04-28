import { useState } from 'react';
import { View, Text } from 'react-native';
import BtnText from '~/components/Button';
import LabeledTextInput from '~/components/LabeledTextInput';
import { AntDesign } from '@expo/vector-icons'; 
import { colors } from '~/styles/colors';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [emailEntered, setEmailEntered] = useState(false);

    const handleContinue = () => {
        if (email.trim() !== '') {
            setEmailEntered(true);
        }
    };

    return (
        <View className='flex-1 items-center justify-center'>
            <View className='w-96 bg-white rounded-2xl shadow-lg p-5'>
                {!emailEntered ? (
                    <View className='p-2'>
                        <Text className='font-semibold text-xl'>Digite o seu e-mail para continuar </Text>

                        <LabeledTextInput label="" onChangeTxt={setEmail} value={email} />

                        <View className='mt-5'>
                            <BtnText bgColor={colors.palette[3]} onPress={handleContinue} title='Continuar' />
                        </View>
                    </View>
                ) : (
                    <View className='p-4 items-center justify-center'>
                        <AntDesign name="checkcircle" size={75} color={colors.palette[2]} className='mb-8' />
                        <Text className='font-semibold text-xl'>Mensagem de confirmação </Text>

                        <Text className='text-center mt-2'>Um e-mail de redefinição de senha foi enviado para {email}.</Text>
                    </View>
                )}


            </View>
        </View>
    );
}
