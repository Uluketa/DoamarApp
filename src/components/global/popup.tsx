import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importe FontAwesome se você estiver usando-o

type TypeError = "S" | "W" | "E";

interface ModalProps {
    typeError: TypeError;
    errorMsg: string;
    isVisible: boolean;
    setIsVisible: (text: boolean) => void; 
}

const ModalPopUp: React.FC<ModalProps> = ({ errorMsg, typeError, isVisible, setIsVisible }) => {
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)} // Adicione essa prop para fechar o modal quando o usuário tocar fora dele
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {typeError === 'W' && <FontAwesome name="exclamation-circle" size={100} color="orange" />} {/* Renderize FontAwesome se o typeError for 'W' */}
                        <Text>{errorMsg}</Text> {/* Exiba a mensagem de erro */}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
    },
});

export default ModalPopUp;
