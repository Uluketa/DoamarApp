import { Modal as RNModal, ModalProps, View, Text } from "react-native";

type PROPS = ModalProps & {
    isOpen: boolean
    title?: string
    error?: boolean
}

export const Modal = ({ isOpen, title, error, children, ...rest }: PROPS) => {
    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
            {...rest}
        >
            <View className="flex items-center justify-center h-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View className="bg-white p-6 rounded w-[70%]">
                    <Text className="font-bold mb-3" style={{fontSize: 20}}>{title}</Text>
                    {/* <Image
                        source={require("../assets/logoDarkGreenA.png")}
                        style={{ width: 40, height: 40 }}
                        resizeMode="contain"
                    /> */}
                    {children}
                </View>
            </View>
        </RNModal>
    )
}