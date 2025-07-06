import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "~/styles/colors";
import { DonationType } from "~/types/donation";

export function DonationCard({ item }: { item: DonationType }) {
    const [quantity, setQuantity] = useState(0);

    return (
        <View>
            <View className="rounded-xl mr-2 overflow-hidden my-1 relative">
                <Image
                    source={{ uri: item.image_url }}
                    style={{ width: 130, height: 140 }}
                />

                {/* Gradiente */}
                <LinearGradient
                    colors={["transparent", colors.palette[3]]}
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
                <View className="flex flex-row items-center justify-between rounded-lg p-2"
                    style={{ borderColor: colors.palette[3],
                        borderWidth: 1, }}>
                    <TouchableOpacity onPress={() => setQuantity(Math.max(0, quantity - 1))}>
                        <Ionicons name="remove-circle" size={24} color={colors.palette[3]} />
                    </TouchableOpacity>

                    <Text className="text-white text-lg" style={{ color: colors.palette[3]}}>{quantity}</Text>

                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                        <Ionicons name="add-circle" size={24} color={colors.palette[3]} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
