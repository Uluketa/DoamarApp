import { TouchableOpacity, View, Text } from "react-native";
import { Donation } from "~/types/entities/Donation";
import { Ionicons } from "@expo/vector-icons";

type DonationCardProps = {
  donation: Donation;
  onPress: () => void;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-amber-100' },
  approved: { label: 'Aprovado', className: 'bg-emerald-100' },
  rejected: { label: 'Rejeitado', className: 'bg-red-100' },
};

export function DonationCard({ donation, onPress }: DonationCardProps) {
  const orderType = donation.order?.order_type ?? donation.order?.orderType;
  const orderTypeName = orderType?.name ?? '-';
  const status = donation.status ?? 'pending';
  const { label: statusLabel, className: statusClass } = statusConfig[status] ?? statusConfig.pending;

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
            {donation.user?.client?.name ?? "Doação anônima"}
          </Text>

          <Text className="text-sm text-slate-500 mt-1">
            {donation.order?.name}
          </Text>
          {donation.quantity != null && donation.quantity > 1 && (
            <Text className="text-xs text-slate-400 mt-0.5">
              Qtd: {donation.quantity}
            </Text>
          )}
        </View>

        <View className={`${statusClass} px-3 py-1 rounded-full`}>
          <Text className={`text-xs font-semibold ${status === 'approved' ? 'text-emerald-700' : status === 'rejected' ? 'text-red-700' : 'text-amber-700'}`}>
            {statusLabel}
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
