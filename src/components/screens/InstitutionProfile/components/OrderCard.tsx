import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "~/styles/colors";
import { Order } from "~/types/entities/Order";

type OrderCardType = {
    item: Order,
    initialQuantity: number,
    onQuantityChange: (item: Order, quantity: number) => void
}

export function OrderCard({ item, onQuantityChange, initialQuantity }: OrderCardType) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const updateQuantity = (newQty: number) => {
        setQuantity(newQty);
        onQuantityChange(item, newQty);
    };

    return (
        <View className="mr-2 rounded-lg w-[120] items-center" style={{ backgroundColor: '#dedede' }}>
            <Image
                source={{ uri: item.image_url }}
                style={{ width: 70, height: 100, resizeMode: "contain" }}
            />

            {/* Texto Centralizado */}
            <Text className="text-center text-md" style={{ color: '#555'}}>{item.name}</Text>

            {/* Botões de Adicionar/Remover */}
   
                <View
                    className="flex flex-row items-center justify-between rounded-lg p-2 w-full"
                >
                    <TouchableOpacity onPress={() => updateQuantity(Math.max(0, quantity - 1))}>
                        <Ionicons name="remove-circle" size={24} color={'#555'} />
                    </TouchableOpacity>

                    <Text className="text-lg" style={{ color: '#555' }}>
                        {quantity}
                    </Text>

                    <TouchableOpacity onPress={() => updateQuantity(quantity + 1)}>
                        <Ionicons name="add-circle" size={24} color={'#555'} />
                    </TouchableOpacity>
                </View>
        </View>
    );
}
