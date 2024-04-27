import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { colors } from '~/styles/colors';

interface TextForgotPasswordProps extends TouchableOpacityProps {
  onPress: () => void;
}

export const TextForgotPassword = forwardRef<TouchableOpacity, TextForgotPasswordProps>(({ onPress }, ref) => {
  return (
    <TouchableOpacity ref={ref} className={styles.button} onPress={onPress} >
      <Text className={styles.buttonText}>Esqueceu a senha?</Text>
    </TouchableOpacity>
  );
});

const styles = {
  button: 'items-end w-full px-5',
  buttonText: 'text-black text-lg font- text-center',
};
