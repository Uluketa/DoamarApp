import { View, Text, Image } from 'react-native';
import { colors } from '~/styles/colors';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/navigation';
import { BtnText as ButtonAvancar } from '~/components/Button';

type ReceiveDonationQuestProps = { navigation: StackNavigationProp<RootStackParamList, 'ReceiveDonationQuest'> };

export const ReceiveDonationQuest = ({ navigation }: ReceiveDonationQuestProps) => {
    return (
        <View className='flex-1 items-center'>
            <View
                className='w-full justify-center items-center h-4/5 rounded-b-3xl'
                style={{ backgroundColor: colors.palette[1] }}
            >
                <Image
                    source={require("~/assets/logoLightGreenB.png")}
                    style={{ width: 150, height: 150 }}
                    className='mb-20'
                />

                <Text className="text-gray-300 text-3xl mb-24 text-center" style={{ lineHeight: 45 }}>
                    Deseja realizar doações para a comunidade através do aplicativo?
                </Text>

                <View className='w-60'>
                    <ButtonAvancar bgColor={colors.palette[3]} onPress={() => navigation.navigate("CompanyHome")} title='Cadastrar Itens' />
                </View>
            </View>

            <View className='items-center justify-center h-1/5 w-40' >
                <ButtonAvancar bgColor='#a8a8a8' onPress={() => navigation.navigate("CompanyHome")} title='Pular' />
            </View>
        </View>
    );
}
