import React from 'react';
import {
    Image,
    TextInput, 
    View
} from 'react-native';
import { colors } from '~/styles/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CartHeader } from '../CartHeader';
import { LogOutHeader } from '../LogOutHeader';

type headerProps = {
    userType: 'client' | 'institution'; 
}

export const Header = ({ userType }: headerProps) => {
    return (
        <View style={{ backgroundColor: colors.palette[1] }} className="flex-row items-center justify-between px-3 py-4">
            <Image
                source={require('~/assets/logoLightGreenB.png')}
                className="w-10 h-10 mx-2"
                resizeMode="contain"
            />

            <View className="flex-row flex-1 items-center bg-gray-200 rounded-lg px-4 mx-2 h-10">
                <Ionicons name="search" size={20} color="#777" />
                <TextInput
                    className="flex-1 h-12 text-base text-gray-700 ml-2"
                    placeholder="Pesquisar..."
                    placeholderTextColor="#777"
                />
            </View>

            {userType == "client" ?  <CartHeader classlist='mr-2' /> : <LogOutHeader />}
        </View>
    );
};