import { TouchableOpacity, View, Text } from "react-native";
import { Donation } from "~/types/entities/Donation";
import { Ionicons } from "@expo/vector-icons";

type DonationCardProps = {
  donation: Donation;
  onPress: () => void;
};

export function DonationCard({ donation, onPress }: DonationCardProps) {
  const orderTypeName = donation.order.order_type.name;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-800">
            {donation.user.client?.name ?? "Doação anônima"}
          </Text>

          <Text className="text-sm text-slate-500 mt-1">
            {donation.order.name}
          </Text>
        </View>

        <View className="bg-emerald-100 px-3 py-1 rounded-full">
          <Text className="text-xs text-emerald-700 font-semibold">
            Recebido
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center">
          <Ionicons name="pricetag-outline" size={14} color="#64748b" />
          <Text className="text-xs text-slate-500 ml-1">
            {orderTypeName}
          </Text>
        </View>

        <Text className="text-xs text-slate-400">
          {donation.created_at &&
            new Date(donation.created_at).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
