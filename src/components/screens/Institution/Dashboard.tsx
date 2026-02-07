import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function InstitutionDashboard() {
  // depois você troca isso por Redux / API
  const institutionName = 'Instituto Esperança';

  const weeklyDonations = [
    { day: 'Seg', value: 12 },
    { day: 'Ter', value: 18 },
    { day: 'Qua', value: 8 },
    { day: 'Qui', value: 22 },
    { day: 'Sex', value: 15 },
    { day: 'Sáb', value: 30 },
    { day: 'Dom', value: 10 },
  ];

  const totalItems = 187;
  const totalDonations = 64;

  const maxDonation = Math.max(...weeklyDonations.map(d => d.value));

  return (
    <ScrollView className="flex-1 px-7 py-10 bg-white">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-xl text-gray-500">Bem-vindo,</Text>
        <Text className="text-2xl font-bold">{institutionName} 👋</Text>
      </View>

      {/* Cards resumo */}
      <View className="flex-row justify-between mb-6">
        <View className="w-[48%] bg-green-100 rounded-2xl p-4">
          <Text className="text-sm text-green-700">Itens recebidos</Text>
          <Text className="text-2xl font-bold text-green-800 mt-2">
            {totalItems}
          </Text>
        </View>

        <View className="w-[48%] bg-blue-100 rounded-2xl p-4">
          <Text className="text-sm text-blue-700">Doações totais</Text>
          <Text className="text-2xl font-bold text-blue-800 mt-2">
            {totalDonations}
          </Text>
        </View>
      </View>

      {/* Doações na semana */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-4">
          Doações na semana
        </Text>

        <View className="bg-gray-50 rounded-2xl p-4">
          {weeklyDonations.map(item => (
            <View key={item.day} className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600">{item.day}</Text>
                <Text className="text-gray-600">{item.value}</Text>
              </View>

              <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-2 bg-green-500 rounded-full"
                  style={{
                    width: `${(item.value / maxDonation) * 100}%`,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Informações extras */}
      <View className="bg-gray-100 rounded-2xl p-5 mb-5">
        <Text className="text-lg font-bold mb-3">
          Resumo rápido 📊
        </Text>

        <Text className="text-gray-600 mb-2">
          • Média diária de doações: {(totalDonations / 7).toFixed(1)}
        </Text>

        <Text className="text-gray-600 mb-2">
          • Dia com mais doações: Sábado
        </Text>

        <Text className="text-gray-600">
          • Última doação recebida: há 2 horas
        </Text>
      </View>
    </ScrollView>
  );
}
