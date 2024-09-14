import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface SettingsButtonProps {
    title: string;
    onPress: () => void;
}

export default function SettingsButton({ title, onPress }: SettingsButtonProps) {
    return (
        <TouchableOpacity className="py-5 border-b border-gray-300" onPress={onPress}>
            <Text className="text-lg">{title}</Text>
        </TouchableOpacity>
    );
}
