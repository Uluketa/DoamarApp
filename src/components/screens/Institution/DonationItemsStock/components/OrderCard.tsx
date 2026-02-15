import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import colors from '~/styles/colors';
import { Order } from '~/types/entities/Order';
import { resolveImageUrl } from '~/api';

type Props = {
    order: Order;
    onEdit: () => void;
    onChangeStatus: (status: Order['status']) => void;
};

export default function OrderCard({
    order,
    onEdit,
    onChangeStatus,
}: Props) {
    const statusColor = {
        available: '#22c55e',
        completed: '#3b82f6',
        canceled: '#ef4444',
    };

    const statusLabel = {
        available: 'Disponível',
        completed: 'Concluído',
        canceled: 'Cancelado',
    };

    return (
        <View
            className="flex-1 rounded-2xl mb-4 overflow-hidden shadow-sm"
        >
            <View className='border rounded-t-2xl' style={{ borderColor: colors.card }}>
                {order.image_url ? (
                    <Image
                        source={{ uri: resolveImageUrl(order.image_url) }}
                        className="w-full h-24 p-2"
                        resizeMode="contain"
                    />
                ) : (
                    <View className='w-full h-24 p-2 items-center justify-center'>
                        <Ionicons name="image-outline" size={32} color="#9ca3af" />
                    </View>
                )}
            </View>

            <View className="p-4 justify-between flex-1" style={{ backgroundColor: colors.card }}>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-bold" style={{ color: colors.text }}>
                        {order.name}
                    </Text>

                    <View className="flex-row items-center gap-2">
                        <Ionicons
                            name="ellipse"
                            size={14}
                            color={statusColor[order.status]}
                        />
                    </View>
                </View>

                {typeof order.description === 'string' && order.description.trim() !== '' && (
                    <Text className="mb-3 text-sm" style={{ color: colors.text + '66' }}>
                        {order.description}
                    </Text>
                )}

                {typeof order.limit === 'number' && order.limit > 0 && (
                    <Text className="text-sm text-gray-500 mb-3">
                        Limite solicitado: {order.limit.toString()}
                    </Text>
                )}

                <View className="flex-row justify-between">
                    <TouchableOpacity
                        className="flex-row items-center gap-1"
                        onPress={onEdit}
                    >
                        <Ionicons name="create-outline" size={16} color="#2563eb" />
                        <Text className="text-blue-600 text-xs font-semibold">
                            Editar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
