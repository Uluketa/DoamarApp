import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '~/styles/colors';

type UserType = "C" | "I";

interface TypeUserProps {
    typeUser: string;
    setTypeUser: (text: UserType) => void;
}

const TypeUser: React.FC<TypeUserProps> = ({ typeUser, setTypeUser }) => {
    return (
        <View className='border-2 border-gray-300 rounded-lg p-3 text-base grid-cols-3 flex-row'>
            <TouchableOpacity className='p-2 w-1/2 items-center' onPress={() => setTypeUser("I")}>
                {(typeUser === "I") && (
                    <View className='absolute w-20 rounded-lg p-8 h-full bg-slate-300' />
                )}
                <AntDesign
                    name="home"
                    size={24}
                    color={(typeUser === "I") ? colors.palette[1] : "rgb(209 213 219)"}
                />
                <Text style={{ color: (typeUser === "I") ? colors.palette[1] : "rgb(209 213 219)" }}>PF</Text>
            </TouchableOpacity>

            <View className='bg-gray-300' style={{ width: '1%' }} />

            <TouchableOpacity className='p-2 w-1/2 items-center' onPress={() => setTypeUser("C")}>
                {(typeUser === "C") && (
                    <View className='absolute w-20 rounded-lg p-8 h-full bg-slate-300' />
                )}
                <AntDesign
                    name="user"
                    size={24}
                    color={(typeUser === "C") ? colors.palette[1] : "rgb(209 213 219)"}
                />
                <Text style={{ color: (typeUser === "C") ? colors.palette[1] : "rgb(209 213 219)" }}>PJ</Text>
            </TouchableOpacity>
        </View>
    );
};

export default TypeUser;