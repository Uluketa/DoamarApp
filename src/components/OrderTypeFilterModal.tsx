import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { useRef } from 'react';
import { ORDER_TYPES } from '~/constants/orderTypes';

type Props = {
  visible: boolean;
  selectedType: number | null;
  onSelect: (id: number | null) => void;
  onClose: () => void;
};

export function OrderTypeFilterModal({
  visible,
  selectedType,
  onSelect,
  onClose,
}: Props) {
  const translateY = useRef(new Animated.Value(0)).current;

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          closeSheet();
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
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-end">
        {/* BACKDROP */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeSheet}
          className="absolute inset-0 bg-black/40"
        />

        {/* SHEET */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ translateY }] }}
          className="bg-white rounded-t-3xl px-6 pt-3 pb-14"
        >
          {/* Handle */}
          <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

          <Text className="text-lg font-bold text-center mb-4">
            Tipo de pedido
          </Text>

          <TouchableOpacity
            onPress={() => {
              onSelect(null);
              closeSheet();
            }}
            className="py-3"
          >
            <Text
              className={`text-base ${
                selectedType === null
                  ? 'font-bold text-green-600'
                  : 'text-gray-700'
              }`}
            >
              Todos
            </Text>
          </TouchableOpacity>

          {Object.values(ORDER_TYPES).map(type => (
            <TouchableOpacity
              key={type.id}
              onPress={() => {
                onSelect(type.id);
                closeSheet();
              }}
              className="py-3"
            >
              <Text
                className={`text-base ${
                  selectedType === type.id
                    ? 'font-bold text-green-600'
                    : 'text-gray-700'
                }`}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}
