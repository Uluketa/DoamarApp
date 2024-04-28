import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  title: string;
  bgColor: string;
}

const BtnText: React.FC<ButtonProps> = ({ onPress, title, bgColor }) => {
  return (
    <TouchableOpacity className="items-center rounded-lg py-4 w-full" style={{ backgroundColor: bgColor }} onPress={onPress} >
      <Text className="text-white text-lg font-semibold text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default BtnText;