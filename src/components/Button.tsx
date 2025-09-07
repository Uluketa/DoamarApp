import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  onPress: () => void;
  title: string;
  bgColor: string;
  loading?: boolean;
}

export const BtnText = ({ onPress, title, bgColor, loading = false, ...rest}: ButtonProps) => {
  return (
    <TouchableOpacity className="items-center rounded-lg py-4 w-full" style={{ backgroundColor: bgColor }} onPress={onPress} disabled={loading} {...rest}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-lg font-semibold text-center">{title}</Text>
      )}
    </TouchableOpacity>
  );
};