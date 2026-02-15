import { useState, useCallback, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { getOrdersByInstitution, createOrder } from '~/api';
import { RootState } from '~/store';
import { setOrdersLoading, setOrders, addOrder as addOrderToStore } from '~/store/modules/institutionData/actions';
import OrderCard from './components/OrderCard';
import OrderModal from './components/OrderModal';
import EmptyState from './components/EmptyState';

import { Order } from '~/types/entities/Order';
import { colors } from '~/styles/colors';

export default function DonationItemsStock() {
    const dispatch = useDispatch();
    const { userData, token } = useSelector((state: RootState) => state.user);
    const { orders, isLoadingOrders } = useSelector((state: RootState) => state.institutionData);
    const institutionId = userData.institution?.id ?? 0;

    const [modalVisible, setModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Buscar pedidos apenas na primeira montagem
    useEffect(() => {
        if (orders.length === 0 && !isLoadingOrders) {
            fetchOrders();
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        if (!institutionId || !token) return;
        dispatch(setOrdersLoading(true));
        const res = await getOrdersByInstitution(institutionId, token);
        if (res.ok === 'S' && res.data) {
            dispatch(setOrders(Array.isArray(res.data) ? res.data : []));
        }
        dispatch(setOrdersLoading(false));
        setIsRefreshing(false);
    }, [institutionId, token, dispatch]);

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
            dispatch(addOrderToStore(res.data as Order));
            setModalVisible(false);
            Toast.show({ type: 'success', text1: 'Pedido criado com sucesso!' });
        } else {
            Toast.show({ type: 'error', text1: res.msg ?? 'Erro ao criar pedido' });
        }
        return res;
    }, [institutionId, token, dispatch]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchOrders();
    };

    if (isLoadingOrders) {
        return (
            <View className='flex-1 justify-center items-center' style={{ backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }

    return (
        <View className='flex-1 py-6' style={{ backgroundColor: colors.background }}>
            <View className="flex-row justify-between items-center mb-6 mx-6">
                <View className="flex-row items-center">
                    <Ionicons name="list" size={28} color={colors.palette[1]} />
                    <Text className="text-2xl font-bold ml-3" style={{ color: colors.text }}>
                        Pedidos {orders.length > 0 && `(${orders.length})`}
                    </Text>
                </View>

                <TouchableOpacity
                    className="px-4 py-2 rounded-full flex-row items-center gap-2"
                    onPress={() => {
                        setSelectedOrder(null);
                        setModalVisible(true);
                    }}
                    style={{ backgroundColor: colors.primary }}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text className="text-white font-semibold">
                        Novo pedido
                    </Text>
                </TouchableOpacity>
            </View>

            <View className='px-6 pb-6'>
                {/* Listagem */}
                {orders.length === 0 ? (
                    <EmptyState />
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ gap: 12 }}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                        }
                        renderItem={({ item }) => (
                            <OrderCard
                                order={item}
                                onEdit={() => {
                                    setSelectedOrder(item);
                                    setModalVisible(true);
                                }}
                                onChangeStatus={() => { }}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <OrderModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedOrder(null);
                }}
                onSave={handleSaveOrder}
                institutionId={institutionId}
                order={selectedOrder}
            />
        </View>
    );
}
