import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "~/styles/colors";
import { Order } from "~/types/entities/Order";

export function OrderCard({ item, onQuantityChange }: { item: Order, onQuantityChange: (item: Order, quantity: number) => void }) {
    const [quantity, setQuantity] = useState(0);

    const updateQuantity = (newQty: number) => {
        setQuantity(newQty);
        onQuantityChange(item, newQty);
    };

    return (
        <View>
            <View className="rounded-xl mr-2 overflow-hidden my-1 relative">
                <Image
                    source={{ uri: item.image_url }}
                    style={{ width: 130, height: 140 }}
                />

                {/* Gradiente */}
                <LinearGradient
                    colors={["transparent", colors.black]}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                    }}
                />

                {/* Texto Centralizado */}
                <View
                    style={{
                        position: "absolute",
                        bottom: 10,
                        left: 0,
                        right: 0,
                        height: 100,
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Text className="text-center text-md text-white">{item.name}</Text>
                </View>
            </View>

            {/* Botões de Adicionar/Remover */}
            <View className="pr-2">
                <View
                    className="flex flex-row items-center justify-between rounded-lg p-2"
                    style={{ borderColor: '#555', borderWidth: 1 }}
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
        </View>
    );
}
