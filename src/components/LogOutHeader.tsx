import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, Pressable, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';
import { RootStackParamList } from '~/types/Navigation';

import * as userReducer from '~/store/modules/user/reducer';
import * as navReducer from '~/store/modules/navigation/reducer';
import * as cartReducer from '~/store/modules/cart/reducer';
import * as homeReducer from '~/store/modules/home/reducer';

import { persistor } from '~/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LogOutHeader = () => {
    const dispatch = useDispatch();

    const confirmLogout = () => {
        Alert.alert(
            "Atenção",
            "Tem certeza que deseja se desconectar?",
            [
                { text: "Cancelar", onPress: () => null, style: "cancel" },
                { text: "Sim", onPress: handleLogout }
            ]
        );
    };

    const handleLogout = async () => {
        try {
            dispatch(userReducer.clearUser());
            dispatch(navReducer.resetNavigation());
            dispatch(cartReducer.clearCart());
            dispatch(homeReducer.clearHome());

            await persistor.purge();
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Erro ao limpar dados durante o logout:', error);
        }
    };

    return (
            <Pressable className={`relative px-2`}  onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={25} color="white" />
        </Pressable>
    );
};