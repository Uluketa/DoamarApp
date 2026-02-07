import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function EmptyState() {
  return (
    <View className="items-center mt-20 px-10">
      <Ionicons name="cube-outline" size={64} color="#9ca3af" />
      <Text className="text-lg font-bold mt-4 text-center">
        Nenhum pedido cadastrado
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        Crie pedidos de itens para que os doadores saibam exatamente o que sua instituição precisa.
      </Text>
    </View>
  );
}
