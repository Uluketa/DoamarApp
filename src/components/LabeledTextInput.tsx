import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface LabeledTextInputProps {
  label: string;
}

const LabeledTextInput: React.FC<LabeledTextInputProps> = ({ label }) => {
  return (
    <View className='mb-3 w-full px-5'>
      <Text className='mb-2 font-bold text-base'>{label}</Text>
      <TextInput className='border-2 border-gray-300 rounded-lg p-3 text-base' />
    </View>
  );
};

export default LabeledTextInput;
