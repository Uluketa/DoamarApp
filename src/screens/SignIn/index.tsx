import { useState } from 'react';
import { View, Text, TextInput, ColorSchemeName } from 'react-native';
import { Button } from '~/components/Button';
import LabeledTextInput from '~/components/LabeledTextInput';
// import { colors } from '~/styles/colors';
import { TextForgotPassword } from './components/TextForgotPassword';
import { useTheme } from '@react-navigation/native';
import { colorScheme } from 'nativewind';

export default function SignIn() {
    const [auth, setAuth] = useState(true);
    const { colors } = useTheme();

    console.log(colorScheme.get())
    console.log(colorScheme.set('dark'))
    console.log(colorScheme.get())

    // console.log(colors)

    return (
        <View className='flex-1 items-center justify-center' style={{ backgroundColor: colors.text }}>
            {/* <View className='w-full' style={{ backgroundColor: colors.palette[0], height: '20%' }} /> */}

            <View className='w-full items-center justify-center px-5' style={{ height: '80%' }}>
                <LabeledTextInput label="Login:" />
                <LabeledTextInput label="Senha:" />
                {/* <TextForgotPassword onPress={() => console.log('teste')}/> */}

                {/* <Button title='Entrar' onPress={() => setAuth(false)} /> */}
            </View>
        </View>
    );
}
