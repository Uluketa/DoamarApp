
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface TextForgotPasswordProps extends TouchableOpacityProps {
  onPress: () => void;
}

const TextForgotPassword: React.FC<TextForgotPasswordProps> = ({ onPress }) => {
  return (
    <TouchableOpacity className="items-end w-full mb-5 p-2" onPress={onPress} >
      <Text className="text-gray-500 text-base text-center" style={{ textDecorationLine: 'underline' }}>Esqueceu a senha?</Text>
    </TouchableOpacity>
  );
};

export default TextForgotPassword;