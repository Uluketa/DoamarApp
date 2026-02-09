import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ORDER_TYPE_ID, ORDER_TYPES } from '~/constants/orderTypes';
import colors from '~/styles/colors';

type Props = {
  selectedPeriod: number;
  selectedOrderType: ORDER_TYPE_ID | null;
  onChangePeriod: (days: number) => void;
  onOpenTypeFilter: () => void;
};

export function FiltersBar({
  selectedPeriod,
  selectedOrderType,
  onChangePeriod,
  onOpenTypeFilter,
}: Props) {
  const periods = [7, 30];

  return (
    <View className="mb-6">
      <Text className="font-bold text-lg mb-3" style={{ color: colors.text }}>Filtros</Text>

      <View className="flex-row items-center justify-between gap-3 flex-wrap">
        <View className='flex-row gap-3 flex-wrap'>
          {periods.map(days => (
            <TouchableOpacity
              key={days}
              className="px-4 py-2 rounded-full border"
              style={{ backgroundColor: selectedPeriod === days ? colors.primary : colors.background, borderColor: selectedPeriod === days ? 'transparent' : colors.secondary }}
              onPress={() => onChangePeriod(days)}
            >
              <Text
                className="font-semibold text-sm"
                style={{ color: selectedPeriod === days ? '#fff' : colors.text }}
              >
                {days} dias
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tipo de pedido */}
        <TouchableOpacity
          onPress={onOpenTypeFilter}
          activeOpacity={0.85}
          className="flex-row items-center gap-2 px-4 py-2 rounded-full border"
              style={{ backgroundColor: selectedPeriod === selectedOrderType ? colors.primary : colors.background, borderColor: selectedPeriod === selectedOrderType ? 'transparent' : colors.secondary }}
        >
          <Ionicons
            name="filter"
            size={16}
            style={{ color: selectedOrderType ? '#fff' : colors.text }}
          />

          <Text
            className="font-semibold text-sm"
            style={{ color: selectedOrderType ? '#fff' : colors.text }}
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
