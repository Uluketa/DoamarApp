import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Order } from '~/types/entities/Order';

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
        <View className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm">
            {order.image_url && (
                <Image
                    source={{ uri: order.image_url }}
                    className="w-full h-32"
                    resizeMode="cover"
                />
            )}

            <View className="p-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-bold">
                        {order.name}
                    </Text>

                    <View className="flex-row items-center gap-2">
                        <Ionicons
                            name="ellipse"
                            size={12}
                            color={statusColor[order.status]}
                        />
                        <Text
                            className="text-sm font-semibold"
                            style={{ color: statusColor[order.status] }}
                        >
                            {statusLabel[order.status]}
                        </Text>
                    </View>
                </View>

                {!!order.description && (
                    <Text className="text-gray-600 mb-3">
                        {order.description}
                    </Text>
                )}

                {order.has_limit && (
                    <Text className="text-sm text-gray-500 mb-3">
                        Limite solicitado: {order.limit}
                    </Text>
                )}

                <View className="flex-row justify-end gap-5 mt-4">
                    <TouchableOpacity
                        className="flex-row items-center gap-1"
                        onPress={onEdit}
                    >
                        <Ionicons name="create-outline" size={18} color="#2563eb" />
                        <Text className="text-blue-600 font-semibold">
                            Editar
                        </Text>
                    </TouchableOpacity>

                    {order.status === 'available' && (
                        <TouchableOpacity
                            className="flex-row items-center gap-1"
                            onPress={() => onChangeStatus('completed')}
                        >
                            <Ionicons name="checkmark-circle-outline" size={18} color="#16a34a" />
                            <Text className="text-green-600 font-semibold">
                                Concluir
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}
