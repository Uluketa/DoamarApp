import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { useRef } from "react";
import { Donation } from "~/types/entities/Donation";

type Props = {
  donation: Donation | null;
  onClose: () => void;
};

export function DonationDetailsModal({ donation, onClose }: Props) {
  if (!donation) return null;

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

  return (
    <Modal transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/40">
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY }] }}
          className="bg-white rounded-t-3xl px-6 pt-3 pb-12"
        >
          {/* Barrinha */}
          <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />

          <Text className="text-xl font-semibold text-slate-900 mb-6 text-center">
            Detalhes da Doação
          </Text>

          <View className="bg-slate-50 rounded-2xl p-4 mb-4">
            <Detail
              label="Nome"
              value={donation.user.client?.name || "Doação anônima"}
            />
            <Detail label="Item" value={donation.order.name} />
            <Detail
              label="Data"
              value={
                donation.created_at
                  ? new Date(donation.created_at).toLocaleDateString("pt-BR")
                  : "-"
              }
            />
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="bg-slate-900 py-3.5 rounded-2xl"
          >
            <Text className="text-white text-center font-semibold text-base">
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
      <Text className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
        {label}
      </Text>
      <Text className="text-base text-slate-800 font-medium">
        {value}
      </Text>
    </View>
  );
}
