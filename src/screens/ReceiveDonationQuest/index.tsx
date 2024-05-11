import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/routes';

import LabeledTextInput from '~/components/LabeledTextInput';
import ButtonAvancar from '~/components/Button';
import { login } from '~/services/api';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'ReceiveDonationQuest'> };

export default function ReceiveDonationQuest({ navigation }: Props) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [vlogin, setvLogin] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View className='flex-1 items-center'>
            <View
                className='w-full justify-center items-center w-full h-4/5 rounded-b-3xl'
                style={{ backgroundColor: colors.palette[1] }}
            >
                <Image
                    source={require("../../assets/logoLightGreenB.png")}
                    style={{ width: 150, height: 150 }}
                    className='mb-20'
                />

                <Text className="text-gray-300 text-3xl mb-24 text-center" style={{ lineHeight: 45}}>Deseja realizar doações para a comunidade através do aplicativo?</Text>

                <View className='w-60'>
                    <ButtonAvancar bgColor={colors.palette[3]} onPress={() => navigation.navigate("HomeCompany")} title='Cadastrar Itens' />
                </View>
            </View>

            <View className='items-center justify-center h-1/5 w-40' >
                <ButtonAvancar bgColor='#a8a8a8' onPress={() => navigation.navigate("HomeCompany")} title='Pular' />
            </View>
        </View>
    );
}
