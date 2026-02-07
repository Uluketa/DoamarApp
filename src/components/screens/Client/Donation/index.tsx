import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '~/store';
import { Donation } from '~/types/entities/Donation';
import { colors } from '~/styles/colors';
import { getDonationsByUser } from '~/api';

export default function DonationHistory() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { userData, token } = useSelector((state: RootState) => state.user);

    const fetchDonations = async () => {
        if (!userData.id || !token) {
            setIsLoading(false);
            setIsRefreshing(false);
            return;
        }
        try {
            const res = await getDonationsByUser(userData.id, token);
            if (res.ok === 'S' && res.data && Array.isArray(res.data)) {
                setDonations(res.data);
            } else {
                setDonations([]);
            }
        } catch (error) {
            console.error('Erro ao buscar doações:', error);
            setDonations([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [userData.id]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchDonations();
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="large" color={colors.palette[1]} />
            </View>
        );
    }

    return (
        <View className='flex-1 py-6' style={{ backgroundColor: colors.background }}>
            <View className="flex-row items-center mx-6 mb-4">
                <Ionicons name="gift" size={28} color={colors.palette[1]} />
                <Text className="text-2xl font-bold ml-3" style={{ color: colors.text }}>
                    Minhas Doações {donations.length > 0 && `(${donations.length})`}
                </Text>
            </View>

            {donations.length === 0 ? (
                <View className='flex-1 justify-center items-center'>
                    <Ionicons name="archive-outline" size={64} color="#ccc" />
                    <Text className="text-center mt-4 text-gray-500 text-lg">
                        Nenhuma doação realizada{'\n'}comece a ajudar!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={donations}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={({ item }) => (
                        <View className="mx-6 mb-4 rounded-xl overflow-hidden shadow-sm border-l-4" style={{ borderLeftColor: colors.palette[1] }}>
                            <View className="p-4 border-r border-t border-b rounded-r-xl" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
                                {/* Header com data */}
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1">
                                        <Text className="text-base font-bold line-clamp-2" style={{ color: colors.text }}>
                                            {item.order?.name || 'Pedido sem nome'}
                                        </Text>
                                        <Text className="text-sm text-gray-500" style={{ color: colors.text }}>
                                            {item.order?.institution?.name || 'Instituição desconhecida'}
                                        </Text>
                                    </View>
                                    <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
                                </View>

                                {/* Descrição */}
                                {item.order?.description && (
                                    <Text className="text-sm text-gray-500 mb-2" numberOfLines={2}>
                                        {item.order.description}
                                    </Text>
                                )}

                                {/* Data e tipo de doação */}
                                <View className="flex-row justify-between items-center pt-3 border-t" style={{ borderColor: colors.background }}>
                                    <Text className="text-xs text-gray-400">
                                        {formatDate(item.created_at || new Date().toISOString())}
                                    </Text>
                                    <View className="flex-row items-center gap-1">
                                        {item.status === 'approved' && (
                                            <>
                                                <Ionicons name="checkmark-done" size={16} color="#16a34a" />
                                                <Text className="text-xs font-semibold text-green-600">Aprovado</Text>
                                            </>
                                        )}
                                        {item.status === 'rejected' && (
                                            <>
                                                <Ionicons name="close-circle" size={16} color="#dc2626" />
                                                <Text className="text-xs font-semibold text-red-600">Rejeitado</Text>
                                            </>
                                        )}
                                        {item.status !== 'approved' && item.status !== 'rejected' && (
                                            <>
                                                <Ionicons name="time" size={16} color="#ca8a04" />
                                                <Text className="text-xs font-semibold text-amber-600">Pendente</Text>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[colors.palette[1]]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
