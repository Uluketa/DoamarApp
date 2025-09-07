import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { BtnText } from '~/components/Button';
import { persistor } from '~/store';
import { clearAll } from '~/store/modules/user/actions';

export default function Home() {
    const dispatch = useDispatch();

    const handleClean = async () => {
        try {
            dispatch(clearAll());

            await persistor.purge();
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Erro ao limpar dados durante o logout:', error);
        }
    }

    return (
        <View className='flex-1 bg-yellow-300 items-center mb-0 pb-0'>
            <BtnText bgColor='#882912' title='Sair' onPress={handleClean}>Sair</BtnText>
        </View>
    );
}
