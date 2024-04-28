import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface LabeledTextInputProps {
  label: string;
  value: string;
  onChangeTxt: (text: string) => void;
}

const LabeledTextInput: React.FC<LabeledTextInputProps> = ({ label, onChangeTxt, value }) => {
  return (
    <View className='mb-3 w-full'>
      <Text className='mb-2 font-bold text-lg'>{label}</Text>
      <TextInput className='border-2 border-gray-300 rounded-lg p-3 text-base' onChangeText={onChangeTxt}/>
    </View>
  );
};

export default LabeledTextInput;
