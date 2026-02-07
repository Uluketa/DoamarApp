import { View, Text } from 'react-native';

type Props = {
  total: number;
};

export function ReceivedChart({ total }: Props) {
  return (
    <View className="bg-white rounded-2xl p-5 mb-6 elevation-xl">
      <Text className="text-lg font-bold mb-2">
        Doações no período
      </Text>

      <Text className="text-4xl font-extrabold text-green-600">
        {total}
      </Text>

      <Text className="text-gray-500 mt-1">
        itens recebidos
      </Text>
    </View>
  );
}
