import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';

type LabeledTextInputProps = TextInputProps & {
  label: string;
  required?: boolean;
}

export const LabeledTextInput = ({ label, required, ...rest }: LabeledTextInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4 w-full">
      <Text className="mb-2 font-bold text-lg">
        {label} <Text style={{ color: 'red' }}>{required ? '*' : ''}</Text>
      </Text>

      <TextInput
        className={`border-2 rounded-lg p-3 text-base ${
          focused ? 'border-green-600' : 'border-gray-300'
        }`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />      
    </View>
  );
};
