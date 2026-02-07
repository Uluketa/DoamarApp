import { useState, useCallback, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { getOrdersByInstitution, createOrder } from '~/api';
import { RootState } from '~/store';
import OrderCard from './components/OrderCard';
import OrderModal from './components/OrderModal';
import EmptyState from './components/EmptyState';

import { Order } from '~/types/entities/Order';

export default function DonationItemsStock() {
    const { userData, token } = useSelector((state: RootState) => state.user);
    const institutionId = userData.institution?.id ?? 0;

    const [modalVisible, setModalVisible] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        if (!institutionId || !token) return;
        setLoading(true);
        const res = await getOrdersByInstitution(institutionId, token);
        if (res.ok === 'S' && res.data) {
            setOrders(Array.isArray(res.data) ? res.data : []);
        }
        setLoading(false);
    }, [institutionId, token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleSaveOrder = useCallback(async (payload: {
        name: string;
        description?: string;
        has_limit: boolean;
        limit?: number | null;
        image_url?: string | null;
        order_type_id: number;
    }) => {
        if (!institutionId || !token) return { ok: 'N' as const, msg: 'Não autorizado' };
        const res = await createOrder({
            ...payload,
            institution_id: institutionId,
        }, token);
        if (res.ok === 'S' && res.data) {
            setOrders(prev => [...prev, res.data as Order]);
            setModalVisible(false);
            Toast.show({ type: 'success', text1: 'Pedido criado com sucesso!' });
        } else {
            Toast.show({ type: 'error', text1: res.msg ?? 'Erro ao criar pedido' });
        }
        return res;
    }, [institutionId, token]);

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
            {loading ? (
                <ActivityIndicator size="large" className="mt-8" />
            ) : orders.length === 0 ? (
                <EmptyState />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
                    }
                    renderItem={({ item }) => (
                        <OrderCard
                            order={item}
                            onEdit={() => setModalVisible(true)}
                            onChangeStatus={() => {}}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <OrderModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveOrder}
                institutionId={institutionId}
            />
        </View>
    );
}
