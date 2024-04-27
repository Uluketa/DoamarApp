import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { colors } from '~/styles/colors';

interface ButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  title: string;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(({ onPress, title }, ref) => {
  return (
    <TouchableOpacity ref={ref} className={styles.button} style={{ backgroundColor: colors.palette[1]}} onPress={onPress} >
      <Text className={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});

const styles = {
  button: 'items-center rounded-lg shadow-md px-8 py-4',
  buttonText: 'text-white text-lg font-semibold text-center',
};
