import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "~/styles/colors";
import { Order } from "~/types/entities/Order";
import { resolveImageUrl } from "~/api";

type OrderCardProps = {
  item: Order;
  initialQuantity: number;
  onQuantityChange: (item: Order, quantity: number) => void;
  showActions?: boolean;
};

export function OrderCard({
  item,
  initialQuantity,
  onQuantityChange,
  showActions = true,
}: OrderCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const updateQuantity = (newQty: number) => {
    setQuantity(newQty);
    onQuantityChange(item, newQty);
  };

  return (
    <View
      className="mr-4 rounded-2xl overflow-hidden"
      style={{
        width: 150,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 4,
      }}
    >
      {/* IMAGE */}
      <View
        className="items-center justify-center py-4"
        style={{ backgroundColor: colors.background }}
      >
        <Image
          source={{ uri: resolveImageUrl(item.image_url) }}
          style={{
            width: 80,
            height: 90,
            resizeMode: "contain",
          }}
        />
      </View>

      {/* CONTENT */}
      <View className="px-3 py-3">
        <Text
          numberOfLines={2}
          className="text-sm font-semibold text-center"
          style={{ color: colors.text }}
        >
          {item.name}
        </Text>

        {showActions && (
          <View
            className="flex-row items-center justify-between mt-4 rounded-full px-3 py-2"
            style={{
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={() => updateQuantity(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
            >
              <Ionicons
                name="remove"
                size={18}
                color={quantity === 0 ? colors.border : colors.palette[1]}
              />
            </TouchableOpacity>

            <Text
              className="text-base font-bold"
              style={{ color: colors.text }}
            >
              {quantity}
            </Text>

            <TouchableOpacity onPress={() => updateQuantity(quantity + 1)}>
              <Ionicons
                name="add"
                size={18}
                color={colors.palette[1]}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
