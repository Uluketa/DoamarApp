import { useEffect } from "react";
import { View, Text, ViewProps } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ModalErrorProps = ViewProps & {
    visible: boolean
}

export const ModalError = ({ visible, children }: ModalErrorProps) => {
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    // Configuração da animação
    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) });
            opacity.value = withTiming(1, { duration: 500 });
        } else {
            translateY.value = withTiming(-100, { duration: 500, easing: Easing.in(Easing.exp) });
            opacity.value = withTiming(0, { duration: 500 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            opacity: opacity.value,
        };
    });

    return (
        <View className="absolute w-full items-center" style={{ zIndex: 10, top: 40 }}>
            <Animated.View className="bg-white p-6 rounded justify-center w-[70%]" style={[animatedStyle, { elevation: 50 }]}>
                <AntDesign className='absolute' style={{ right: 20 }} name="exclamationcircle" size={30} color='orange' />
                <Text className="font-bold" style={{ fontSize: 17, width: '80%' }}>{children}</Text>
            </Animated.View>
        </View>
    )
}