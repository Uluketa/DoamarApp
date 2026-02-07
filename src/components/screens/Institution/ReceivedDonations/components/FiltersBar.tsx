import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ORDER_TYPE_ID, ORDER_TYPES } from '~/constants/orderTypes';

type Props = {
  selectedPeriod: number;
  selectedOrderType: ORDER_TYPE_ID  | null;
  onChangePeriod: (days: number) => void;
  onOpenTypeFilter: () => void;
};

export function FiltersBar({
  selectedPeriod,
  selectedOrderType,
  onChangePeriod,
  onOpenTypeFilter,
}: Props) {
  const periods = [7, 30, 90];

  return (
    <View className="mb-6">
      <Text className="font-bold text-lg mb-3">Filtros</Text>

      <View className="flex-row items-center gap-3 flex-wrap">
        {/* Períodos */}
        {periods.map(days => (
          <TouchableOpacity
            key={days}
            className={`px-4 py-2 rounded-full border
              ${
                selectedPeriod === days
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-300'
              }`}
            onPress={() => onChangePeriod(days)}
          >
            <Text
              className={`font-semibold
                ${
                  selectedPeriod === days
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
            >
              {days} dias
            </Text>
          </TouchableOpacity>
        ))}

        {/* Tipo de pedido */}
        <TouchableOpacity
          onPress={onOpenTypeFilter}
          activeOpacity={0.85}
          className={`flex-row items-center gap-2 px-4 py-2 rounded-full border
            ${
              selectedOrderType
                ? 'bg-emerald-100 border-emerald-300'
                : 'border-gray-300'
            }`}
        >
          <Ionicons
            name="filter"
            size={16}
            color={selectedOrderType ? '#047857' : '#6b7280'}
          />

          <Text
            className={`font-semibold
              ${
                selectedOrderType
                  ? 'text-emerald-700'
                  : 'text-gray-700'
              }`}
          >
            {selectedOrderType
              ? ORDER_TYPES[selectedOrderType].name
              : 'Tipo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
