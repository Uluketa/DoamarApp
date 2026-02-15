import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';
import colors from '~/styles/colors';

type LabeledTextInputProps = TextInputProps & {
  label: string;
  required?: boolean;
};

export const LabeledTextInput = ({ label, required, ...rest }: LabeledTextInputProps) => {
  const [focused, setFocused] = useState(false);

  const isEditable = rest.editable !== false;

  return (
    <View className="mb-4 w-full">
      <Text className="mb-2 font-bold text-lg" style={{ color: colors.text }}>
        {label} <Text style={{ color: 'red' }}>{required ? '*' : ''}</Text>
      </Text>

      <TextInput
        className="border-2 rounded-lg p-3"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={colors.secondary}
        editable={rest.editable}
        style={[
          {
            fontFamily: 'Poppins-Regular',
            borderColor: focused ? '#4ade80' : colors.border,
            color: colors.text,
            backgroundColor: isEditable
              ? 'transparent'
              : colors.border
          },
          rest.style,
        ]}
        {...rest}
      />
    </View>
  );
};
