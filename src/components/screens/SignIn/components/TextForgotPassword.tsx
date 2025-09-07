
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type TextForgotPasswordProps = TouchableOpacityProps & {
  onPress: () => void;
}

export const TextForgotPassword = ({ onPress }: TextForgotPasswordProps) => {
  return (
    <TouchableOpacity className="items-end w-full mb-5 p-2" onPress={onPress} >
      <Text className="text-gray-500 text-base text-center underline">Esqueceu a senha?</Text>
    </TouchableOpacity>
  );
};