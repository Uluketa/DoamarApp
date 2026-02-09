import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '~/styles/colors';
import { RootState } from '~/store';
import { fetchInstitutionSummary, fetchInstitutionDonations, fetchLatestInstitutionDonations } from '~/api';
import { useTheme } from '~/contexts/ThemeContext';
import { RootStackParamList } from '~/types/Navigation';
import { setNavigationScreen } from '~/store/modules/navigation/actions';

export default function InstitutionHome() {
    const { userData, token } = useSelector((state: RootState) => state.user);
    const institutionName = userData.institution?.name || 'Instituição';

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any | null>(null);
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        const load = async () => {
            const institutionId = userData.institution?.id ?? 0;
            if (!institutionId) {
                setSummary(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            const result = await fetchInstitutionSummary(institutionId, token);
            if (result?.ok === 'S') {
                setSummary(result.data || null);
                // toggleTheme();
            } else {
                setSummary(null);
            }
            setLoading(false);
        };

        load();
    }, [userData.institution?.id, token]);

    const weeklyDonations = summary?.weeklyDonations ?? [];
    const totalItems = summary?.totalItems ?? 0;
    const totalDonations = summary?.totalDonations ?? 0;
    const lastDonation = summary?.lastDonation ?? null;

    const maxDonation = useMemo(() => {
        if (!weeklyDonations || weeklyDonations.length === 0) return 1;
        return Math.max(...weeklyDonations.map((d: any) => d.value || 0), 1);
    }, [weeklyDonations]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [dayDonations, setDayDonations] = useState<any[]>([]);
    const [loadingDayDonations, setLoadingDayDonations] = useState(false);
    const [latestDonations, setLatestDonations] = useState<any[]>([]);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const openDayModal = async (date: string) => {
        setSelectedDate(date);
        setModalVisible(true);
        await loadDonationsForDate(date);
    };

    const loadDonationsForDate = async (date: string) => {
        const institutionId = userData.institution?.id ?? 0;
        if (!institutionId) return;
        setLoadingDayDonations(true);
        const res = await fetchInstitutionDonations(institutionId, date, token);
        if (res?.ok === 'S') {
            setDayDonations(res.data || []);
        } else {
            setDayDonations([]);
        }
        setLoadingDayDonations(false);
    };

    const loadLatestDonations = async () => {
        const institutionId = userData.institution?.id ?? 0;
        if (!institutionId) return;
        const res = await fetchLatestInstitutionDonations(institutionId, 6, token);
        if (res?.ok === 'S') {
            setLatestDonations(res.data || []);
        } else {
            setLatestDonations([]);
        }
    };

    useEffect(() => {
        if (!loading) loadLatestDonations();
    }, [loading]);


    if (loading) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 px-7 py-10" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View className="mb-8">
                <Text className="text-xl" style={{ color: colors.text + 'CC' }}>Bem-vindo,</Text>
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>{institutionName} 👋</Text>
            </View>

            {/* Cards resumo */}
            <View className="flex-row justify-between mb-6">
                <View className="w-[48%] rounded-2xl p-4" style={{ backgroundColor: theme == 'dark' ? '#052405' : '#e3ebe0' }}>
                    <Text className="text-sm text-green-600">Itens recebidos</Text>
                    <Text className="text-2xl font-bold text-green-600 mt-2">{totalItems}</Text>
                </View>

                <View className="w-[48%] rounded-2xl p-4" style={{ backgroundColor: theme == 'dark' ? '#05244c' : '#dbe9f7' }}>
                    <Text className="text-sm text-blue-600">Doações totais</Text>
                    <Text className="text-2xl font-bold text-blue-600 mt-2">{totalDonations}</Text>
                </View>
            </View>

            {/* Doações na semana */}
            <View className="mb-8">
                <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>Doações na semana</Text>

                <View className="rounded-2xl p-6" style={{ backgroundColor: colors.card }}>
                    {weeklyDonations.map((item: any) => (
                        <TouchableOpacity key={item.date} className="mb-4" activeOpacity={0.8} onPress={() => openDayModal(item.date)}>
                            <View className="flex-row justify-between mb-2">
                                <Text style={{ color: colors.secondary }}>{item.day}</Text>
                                <Text style={{ color: colors.secondary }}>{item.value}</Text>
                            </View>

                            <View className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.secondary }}>
                                <View className="h-2 bg-green-500 rounded-full" style={{ width: `${(item.value / maxDonation) * 100}%` }} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Informações extras */}
            <View className="rounded-2xl p-5 mb-5" style={{ backgroundColor: colors.card }}>
                <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>Resumo rápido 📊</Text>

                <View className="mb-2 flex-row items-center justify-between">
                    <Text style={{ color: colors.secondary }}>Média diária de doações</Text>
                    <Text style={{ color: colors.secondary }}>{(totalDonations / 7).toFixed(1)}</Text>
                </View>

                <View className="mb-2 flex-row items-center justify-between">
                    <Text style={{ color: colors.secondary }}>Dia com mais doações</Text>
                    <Text style={{ color: colors.secondary }}>{weeklyDonations.length ? weeklyDonations.reduce((a: any, b: any) => (a.value > b.value ? a : b)).day : '—'}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text style={{ color: colors.secondary }}>Última doação recebida</Text>
                    <Text style={{ color: colors.secondary }}>{lastDonation ? `${lastDonation.order?.name ?? ''}` : '—'}</Text>
                </View>
            </View>

            {/* Últimas doações */}
            <View className="rounded-2xl p-5 mb-6" style={{ backgroundColor: colors.card }}>
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold" style={{ color: colors.text }}>Últimas doações</Text>
                    <TouchableOpacity onPress={() => dispatch(setNavigationScreen({ screen: 'Orders' }))}>
                        <Text style={{ color: colors.primary }}>Ver mais</Text>
                    </TouchableOpacity>
                </View>

                {latestDonations.length === 0 ? (
                    <Text style={{ color: colors.secondary }}>Nenhuma doação recente</Text>
                ) : (
                    <FlatList
                        data={latestDonations}
                        keyExtractor={(it) => String(it.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const status = item.status || 'pending';
                            const statusColor = status === 'approved' ? '#16a34a' : status === 'rejected' ? '#ef4444' : '#f59e0b';
                            return (
                                <TouchableOpacity className="mr-3 p-3 rounded-2xl" style={{ backgroundColor: colors.background + 'AA', width: 220 }} activeOpacity={0.8}>
                                    <View className="flex-row justify-between items-start mb-2">
                                        <Text style={{ color: colors.text, fontWeight: '700' }}>{item.order?.name ?? item.order_name ?? 'Pedido'}</Text>
                                        <View style={{ backgroundColor: statusColor, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                                            <Text style={{ color: '#fff', fontSize: 12 }}>{status.toUpperCase()}</Text>
                                        </View>
                                    </View>

                                    <Text style={{ color: colors.secondary, marginBottom: 6 }}>{item.client?.name ?? item.client_name ?? 'Anônimo'}</Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text style={{ color: colors.text, fontWeight: '700' }}>{item.quantity}</Text>
                                        <Text style={{ color: colors.secondary, fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
            </View>

            {/* Modal: doações por dia */}
            <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View className="bg-white rounded-t-2xl p-4" style={{ maxHeight: '70%' }}>
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-lg font-bold">Doações: {selectedDate}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: colors.primary }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row mb-3">
                            {weeklyDonations.map((d: any) => (
                                <TouchableOpacity key={d.date} onPress={() => loadDonationsForDate(d.date)} className="mr-2 px-3 py-1 rounded-full" style={{ backgroundColor: selectedDate === d.date ? colors.primary : colors.card }}>
                                    <Text style={{ color: selectedDate === d.date ? '#fff' : colors.text }}>{d.day}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {loadingDayDonations ? (
                            <View className="py-8 items-center">
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : (
                            <FlatList
                                data={dayDonations}
                                keyExtractor={(it) => String(it.id)}
                                renderItem={({ item }) => (
                                    <View className="py-2 border-b" style={{ borderColor: colors.border }}>
                                        <View className="flex-row justify-between">
                                            <Text style={{ color: colors.text }}>{item.order_name}</Text>
                                            <Text style={{ color: colors.text }}>{item.quantity}</Text>
                                        </View>
                                        <Text style={{ color: colors.secondary, fontSize: 12 }}>{item.client_name ?? 'Anônimo'}</Text>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}