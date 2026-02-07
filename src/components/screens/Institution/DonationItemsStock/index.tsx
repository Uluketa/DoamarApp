import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import OrderCard from './components/OrderCard';
import OrderModal from './components/OrderModal';
import EmptyState from './components/EmptyState';

import { Order } from '~/types/entities/Order';
import { mockOrders } from '~/mocks/orders.mock';

export default function DonationItemsStock() {
    const [modalVisible, setModalVisible] = useState(false);

    const [orders, setOrders] = useState(mockOrders);

    const changeOrderStatus = (id: number, status: Order['status']) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === id
                    ? { ...order, status }
                    : order
            )
        );
    };

    return (
        <View className="flex-1 py-10 px-7 bg-gray-50">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold">
                    Pedidos
                </Text>

                <TouchableOpacity
                    className="bg-green-600 px-4 py-2 rounded-full flex-row items-center gap-2"
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text className="text-white font-semibold">
                        Novo pedido
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Listagem */}
            {orders.length === 0 ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <OrderCard
                            order={item}
                            onEdit={() => setModalVisible(true)}
                            onChangeStatus={(status) =>
                                changeOrderStatus(item.id, status)
                            }
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <OrderModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={() => setModalVisible(false)}
            />
        </View>
    );
}
