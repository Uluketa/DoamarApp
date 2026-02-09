import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { colors } from '~/styles/colors';

export default function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center" >
      <Ionicons name="cube-outline" size={64} color={colors.secondary} />
      <Text className="text-lg font-bold mt-4 text-center" style={{ color: colors.text }}>
        Nenhum pedido cadastrado
      </Text>
      <Text className="text-center mt-2" style={{ color: colors.secondary }}>
        Crie pedidos de itens para que os doadores saibam exatamente o que sua instituição precisa.
      </Text>
    </View>
  );
}
