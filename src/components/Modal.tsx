import {
    Modal as RNModal,
    ModalProps as RNModalProps,
    View,
    Text
} from "react-native";

type ModalProps = RNModalProps & {
    isOpen: boolean
    title?: string
    error?: boolean
}

export const Modal = ({ isOpen, title, error, children, ...rest }: ModalProps) => {
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
                    <Text className="font-bold mb-3" style={{ fontSize: 20 }}>{title}</Text>
                    {children}
                </View>
            </View>
        </RNModal>
    )
}