import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { useRef, useState } from "react";
import { Donation } from "~/types/entities/Donation";
import { updateDonationStatus } from "~/api";
import { useSelector } from "react-redux";
import { RootState } from "~/store";
import Toast from "react-native-toast-message";
import { colors } from "~/styles/colors";

type Props = {
  donation: Donation | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
};

export function DonationDetailsModal({ donation, onClose, onStatusUpdated }: Props) {
  const { token } = useSelector((state: RootState) => state.user);
  const [updating, setUpdating] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleStatus = async (status: "approved" | "rejected") => {
    if (!donation || !token || updating) return;
    setUpdating(true);
    const res = await updateDonationStatus(donation.id, status, token);
    setUpdating(false);
    if (res.ok === "S") {
      Toast.show({
        type: "success",
        text1: status === "approved" ? "Doação aprovada" : "Doação rejeitada",
        text2: status === "approved"
          ? "A pontuação do doador foi atualizada."
          : undefined,
      });
      onStatusUpdated?.();
      onClose();
    } else {
      Toast.show({
        type: "error",
        text1: res.msg ?? "Erro ao atualizar status",
      });
    }
  };

  if (!donation) return null;

  const status = donation.status ?? "pending";
  const canApproveReject = status === "pending";

  return (
    <Modal transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/40">
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY }], backgroundColor: colors.card }}
          className="rounded-t-3xl px-6 pt-3 pb-12"
        >
          {/* Barrinha */}
          <View className="w-12 h-1.5 rounded-full self-center mb-4" style={{ backgroundColor: colors.border }} />

          <Text className="text-xl font-semibold mb-6 text-center" style={{ color: colors.text }}>
            Detalhes da Doação
          </Text>

          <View className="rounded-2xl p-4 mb-4" style={{ backgroundColor: colors.background }}>
            <Detail
              label="Nome"
              value={donation.user?.client?.name || "Doação anônima"}
            />
            <Detail label="Item" value={donation.order?.name ?? "-"} />
            <Detail
              label="Quantidade"
              value={String(donation.quantity ?? 1)}
            />
            <Detail
              label="Data"
              value={
                donation.created_at
                  ? new Date(donation.created_at).toLocaleDateString("pt-BR")
                  : "-"
              }
            />
            <Detail
              label="Status"
              value={status === "pending" ? "Pendente" : status === "approved" ? "Aprovado" : "Rejeitado"}
            />
          </View>

          {canApproveReject && (
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                onPress={() => handleStatus("rejected")}
                disabled={updating}
                className="flex-1 bg-red-500 py-3.5 rounded-2xl"
              >
                {updating ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white text-center font-semibold">Rejeitar</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleStatus("approved")}
                disabled={updating}
                className="flex-1 bg-emerald-500 py-3.5 rounded-2xl"
              >
                {updating ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white text-center font-semibold">Aprovar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={onClose}
            className="py-3.5 rounded-2xl"
            style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
          >
            <Text className="text-center font-semibold text-base" style={{ color: colors.text }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-4">
      <Text className="text-xs mb-1 uppercase tracking-wide" style={{ color: colors.text + 'AA' }}>
        {label}
      </Text>
      <Text className="text-base font-medium" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}
