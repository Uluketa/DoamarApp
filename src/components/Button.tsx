import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  onPress: () => void;
  title: string;
  bgColor: string;
}

export const BtnText = ({ onPress, title, bgColor, ...rest}: ButtonProps) => {
  return (
    <TouchableOpacity className="items-center rounded-lg py-4 w-full" style={{ backgroundColor: bgColor }} onPress={onPress} >
      <Text className="text-white text-lg font-semibold text-center">{title}</Text>
    </TouchableOpacity>
  );
};