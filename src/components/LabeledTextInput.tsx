import { View, Text, TextInput, TextInputProps } from 'react-native';

type LabeledTextInputProps = TextInputProps & {
  label: string;
  required?: boolean;
}

export const LabeledTextInput = ({ label, required, ...rest}: LabeledTextInputProps) => {
  return (
    <View className='mb-3 w-full'>
      <Text className='mb-2 font-bold text-lg'>
        {label} <Text style={{ color: 'red' }}>{required ? "*" : ""}</Text>
      </Text>
      <TextInput
        className='border-2 border-gray-300 rounded-lg p-3 text-base'
        {...rest}
      />
    </View>
  );
};