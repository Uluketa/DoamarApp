import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

import { getDonationsByInstitution } from '~/api';
import { RootState } from '~/store';
import { Donation } from '~/types/entities/Donation';
import { RootStackParamList } from '~/types/Navigation';
import colors from '~/styles/colors';

type PeriodOption = { label: string; value: number };

const PERIODS: PeriodOption[] = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
  { label: '90 dias', value: 90 },
];

const statusLabelMap: Record<string, string> = {
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  pending: 'Pendente',
};

const statusColorMap: Record<string, string> = {
  approved: '#16a34a',
  rejected: '#dc2626',
  pending: '#f59e0b',
};

const InstitutionReports: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { userData, token } = useSelector((state: RootState) => state.user);
  const institutionId = userData.institution?.id ?? 0;

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  const fetchDonations = useCallback(async () => {
    if (!institutionId || !token) return;
    setLoading(true);
    const res = await getDonationsByInstitution(institutionId, token);
    if (res.ok === 'S' && res.data) {
      setDonations(Array.isArray(res.data) ? res.data : []);
    } else {
      setDonations([]);
    }
    setLoading(false);
  }, [institutionId, token]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const filteredDonations = useMemo(() => {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - selectedPeriod);

    return donations.filter(donation => {
      if (!donation.created_at) return false;
      const donationDate = new Date(donation.created_at);
      return donationDate >= limitDate;
    });
  }, [donations, selectedPeriod]);

  const totals = useMemo(() => {
    const totalItems = filteredDonations.reduce(
      (acc, donation) => acc + (donation.quantity ?? 1),
      0
    );

    const statusCounts = filteredDonations.reduce(
      (acc, donation) => {
        const status = donation.status ?? 'pending';
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const donorsMap = filteredDonations.reduce((acc, donation) => {
      const name = donation.user?.client?.name ?? 'Anônimo';
      acc[name] = (acc[name] ?? 0) + (donation.quantity ?? 1);
      return acc;
    }, {} as Record<string, number>);

    const topDonors = Object.entries(donorsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const orderTypeMap = filteredDonations.reduce((acc, donation) => {
      const orderTypeName = donation.order?.order_type?.name ?? 'Sem tipo';
      acc[orderTypeName] = (acc[orderTypeName] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const orderTypeList = Object.entries(orderTypeMap)
      .sort((a, b) => b[1] - a[1]);

    return {
      totalItems,
      statusCounts,
      topDonors,
      orderTypeList,
    };
  }, [filteredDonations]);

  const buildCsv = (rows: string[][]) => {
    const escapeValue = (value: string) => {
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    return rows
      .map(row => row.map((value) => escapeValue(value ?? '')).join(','))
      .join('\n');
  };

  const exportDonationsReport = async () => {
    if (filteredDonations.length === 0) {
      Toast.show({ type: 'info', text1: 'Sem dados para exportar' });
      return;
    }

    try {
      const header = [
        'Data',
        'Doador',
        'Email',
        'Item',
        'Quantidade',
        'Status',
        'Tipo',
      ];

      const rows = filteredDonations.map(donation => {
        const status = donation.status ?? 'pending';
        const statusLabel = statusLabelMap[status] ?? 'Pendente';
        const createdAt = donation.created_at
          ? new Date(donation.created_at).toLocaleDateString('pt-BR')
          : '-';
        return [
          createdAt,
          donation.user?.client?.name ?? 'Anônimo',
          donation.user?.client?.email ?? '-',
          donation.order?.name ?? '-',
          String(donation.quantity ?? 1),
          statusLabel,
          donation.order?.order_type?.name ?? '-',
        ];
      });

      const csv = buildCsv([header, ...rows]);

      const periodLabel = selectedPeriod === 7
        ? '7dias'
        : selectedPeriod === 30
          ? '30dias'
          : `${selectedPeriod}dias`;

      const dateLabel = new Date().toISOString().slice(0, 10);
      const fileName = `relatorio-doacoes-${periodLabel}-${dateLabel}.csv`;

      if (!FileSystem.documentDirectory) {
        Alert.alert('Erro', 'Não foi possível gerar o arquivo.');
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo.');
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Relatório de doações',
      });

      Toast.show({ type: 'success', text1: 'Relatório exportado' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar o relatório.');
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="analytics" size={28} color={colors.palette[1]} />
            <Text className="text-2xl font-bold ml-3" style={{ color: colors.text }}>
              Relatórios
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('InstitutionSettings')}
            className="p-2 rounded-full"
            style={{ backgroundColor: colors.card }}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Period filter */}
        <View className="flex-row gap-3 mb-6 flex-wrap">
          {PERIODS.map(period => (
            <TouchableOpacity
              key={period.value}
              onPress={() => setSelectedPeriod(period.value)}
              className="px-4 py-2 rounded-full border"
              style={{
                backgroundColor:
                  selectedPeriod === period.value ? colors.primary : colors.background,
                borderColor:
                  selectedPeriod === period.value ? 'transparent' : colors.secondary,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: selectedPeriod === period.value ? '#fff' : colors.text,
                }}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 rounded-2xl p-4" style={{ backgroundColor: colors.card }}>
            <Text className="text-xs" style={{ color: colors.secondary }}>
              Doações recebidas
            </Text>
            <Text className="text-2xl font-bold mt-2" style={{ color: colors.text }}>
              {filteredDonations.length}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl p-4" style={{ backgroundColor: colors.card }}>
            <Text className="text-xs" style={{ color: colors.secondary }}>
              Itens recebidos
            </Text>
            <Text className="text-2xl font-bold mt-2" style={{ color: colors.text }}>
              {totals.totalItems}
            </Text>
          </View>
        </View>

        {/* Report: Donations received */}
        <View className="rounded-2xl p-4 mb-6" style={{ backgroundColor: colors.card }}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              Doações recebidas
            </Text>
            <TouchableOpacity
              onPress={exportDonationsReport}
              className="px-3 py-2 rounded-full flex-row items-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text className="text-white text-xs font-semibold">Exportar Excel</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : filteredDonations.length === 0 ? (
            <Text style={{ color: colors.secondary }}>Nenhuma doação no período.</Text>
          ) : (
            filteredDonations.slice(0, 6).map((donation) => {
              const status = donation.status ?? 'pending';
              const statusColor = statusColorMap[status] ?? statusColorMap.pending;
              return (
                <View
                  key={donation.id}
                  className="py-3 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                        {donation.user?.client?.name ?? 'Anônimo'}
                      </Text>
                      <Text className="text-xs mt-1" style={{ color: colors.secondary }}>
                        {donation.order?.name ?? '-'} • Qtd: {donation.quantity ?? 1}
                      </Text>
                    </View>
                    <View className="px-2 py-1 rounded-full" style={{ backgroundColor: statusColor }}>
                      <Text className="text-[10px] font-semibold text-white">
                        {statusLabelMap[status] ?? 'Pendente'}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[10px] mt-2" style={{ color: colors.secondary }}>
                    {donation.created_at
                      ? new Date(donation.created_at).toLocaleDateString('pt-BR')
                      : '-'}
                  </Text>
                </View>
              );
            })
          )}

          {filteredDonations.length > 6 && (
            <Text className="text-xs mt-3" style={{ color: colors.secondary }}>
              Mostrando 6 de {filteredDonations.length} doações.
            </Text>
          )}
        </View>

        {/* Extra report: Status summary */}
        <View className="rounded-2xl p-4 mb-6" style={{ backgroundColor: colors.card }}>
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Resumo por status
          </Text>

          {['approved', 'pending', 'rejected'].map((status) => (
            <View key={status} className="flex-row justify-between mb-2">
              <Text style={{ color: colors.secondary }}>
                {statusLabelMap[status]}
              </Text>
              <Text style={{ color: colors.text, fontWeight: '700' }}>
                {totals.statusCounts[status] ?? 0}
              </Text>
            </View>
          ))}
        </View>

        {/* Extra report: Top donors + order types */}
        <View className="rounded-2xl p-4 mb-10" style={{ backgroundColor: colors.card }}>
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Top doadores e tipos
          </Text>

          <Text className="text-xs font-semibold mb-2" style={{ color: colors.secondary }}>
            Doadores
          </Text>
          {totals.topDonors.length === 0 ? (
            <Text style={{ color: colors.secondary }}>Sem dados no período.</Text>
          ) : (
            totals.topDonors.map(([name, count]) => (
              <View key={name} className="flex-row justify-between mb-2">
                <Text style={{ color: colors.text }}>{name}</Text>
                <Text style={{ color: colors.text }}>{count}</Text>
              </View>
            ))
          )}

          <View className="h-px my-4" style={{ backgroundColor: colors.border }} />

          <Text className="text-xs font-semibold mb-2" style={{ color: colors.secondary }}>
            Tipos de pedido
          </Text>
          {totals.orderTypeList.length === 0 ? (
            <Text style={{ color: colors.secondary }}>Sem dados no período.</Text>
          ) : (
            totals.orderTypeList.slice(0, 5).map(([name, count]) => (
              <View key={name} className="flex-row justify-between mb-2">
                <Text style={{ color: colors.text }}>{name}</Text>
                <Text style={{ color: colors.text }}>{count}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default InstitutionReports;
