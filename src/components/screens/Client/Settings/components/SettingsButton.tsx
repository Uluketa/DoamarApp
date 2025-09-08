import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SettingsButtonProps {
    title: string;
    onPress: () => void;
    iconName: keyof typeof Feather.glyphMap;
    bbtm?: boolean;
    color?: string;
}

export default function SettingsButton({ title, onPress, iconName, bbtm = true, color = 'black' }: SettingsButtonProps) {
    let btnClassName = (bbtm && "border-b border-gray-300") + " py-5 flex-row items-center";

    return (
        <TouchableOpacity className={btnClassName} onPress={onPress}>
            <Feather name={iconName} size={15} className="mr-3" color={color} />
            <Text className="text-lg" style={{ color }}>{title}</Text>
        </TouchableOpacity>
    );
}
