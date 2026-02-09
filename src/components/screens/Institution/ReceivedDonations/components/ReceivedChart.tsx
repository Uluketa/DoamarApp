import { View, Text } from 'react-native';
import colors from '~/styles/colors';

type Props = {
  total: number;
};

export function ReceivedChart({ total }: Props) {
  return (
    <View className="rounded-2xl p-5 mb-6 elevation-xl" style={{ backgroundColor: colors.card }}>
      <Text className="text-lg font-bold mb-2" style={{ color: colors.text }}>
        Doações no período
      </Text>

      <Text className="text-4xl font-extrabold text-green-600">
        {total}
      </Text>

      <Text className="text-sm mt-1" style={{ color: colors.secondary }}>
        itens recebidos
      </Text>
    </View>
  );
}
