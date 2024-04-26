import { View, Text, TextInput } from 'react-native';
import { Button } from '~/components/Button';
import LabeledTextInput from '~/components/LabeledTextInput';
import { colors } from '~/styles/colors';

export default function SignIn() {
    return (
        <View className='flex-1 items-center justify-center'>
            <View className='w-full' style={{ backgroundColor: colors.palette[0], height: '20%' }} />

            <View className='w-full items-center justify-center px-5' style={{ height: '80%' }}>
                <LabeledTextInput label="Login:" />
                <LabeledTextInput label="Senha:" />

                <Button title='Entrar' onPress={console.log('aa')} />
            </View>
        </View>
    );
}
