import { TouchableOpacity, View, Text } from "react-native";
import { Donation } from "~/types/entities/Donation";
import { Ionicons } from "@expo/vector-icons";
import colors, { getAppTheme } from "~/styles/colors";

type DonationCardProps = {
  donation: Donation;
  onPress: () => void;
};

const getStatusStyles = () => {
  const isDark = getAppTheme() === 'dark';

  return {
    pending: {
      label: 'Pendente',
      backgroundColor: isDark ? '#78350f' : '#fef3c7',
      textColor: isDark ? '#fde68a' : '#b45309',
    },
    approved: {
      label: 'Aprovado',
      backgroundColor: isDark ? '#064e3b' : '#d1fae5',
      textColor: isDark ? '#a7f3d0' : '#047857',
    },
    rejected: {
      label: 'Rejeitado',
      backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
      textColor: isDark ? '#fecaca' : '#b91c1c',
    },
  };
};

export function DonationCard({ donation, onPress }: DonationCardProps) {
  const orderType = donation.order?.order_type ?? donation.order?.order_type;
  const orderTypeName = orderType?.name ?? '-';
  const status = donation.status ?? 'pending';
  const statusStyles = getStatusStyles();
  const { label: statusLabel, backgroundColor, textColor } =
    statusStyles[status] ?? statusStyles.pending;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="rounded-2xl p-4 mb-3 shadow-sm border" 
      style={{ borderColor: colors.border, backgroundColor: colors.background }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: colors.text }}>
            {donation.user?.client?.name ?? "Doação anônima"}
          </Text>

          <Text className="text-sm mt-2" style={{ color: colors.text + 'AA' }}>
            {donation.order?.name}
          </Text>

          {donation.quantity != null && donation.quantity > 1 && (
            <Text className="text-xs text-slate-400 mt-0.5" style={{ color: colors.text + 'AA' }}>
              Qtd: {donation.quantity}
            </Text>
          )}
        </View>

        <View className="px-3 py-1 rounded-full" style={{ backgroundColor }}>
          <Text className="text-xs font-semibold" style={{ color: textColor }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center">
          <Ionicons name="pricetag-outline" size={14} color={colors.secondary} />
          <Text className="text-xs ml-1" style={{ color: colors.secondary }}>
            {orderTypeName}
          </Text>
        </View>

        <Text className="text-xs" style={{ color: colors.secondary }}>
          {donation.created_at &&
            new Date(donation.created_at).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
