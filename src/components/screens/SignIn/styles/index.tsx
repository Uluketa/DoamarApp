import { StyleSheet } from "react-native";
import { colors } from "~/styles/colors";

export const styles = StyleSheet.create({
    imgKeyVisible: {
        width: 50,
        height: 50
    },
    imgKeyNotVisible: {
        width: 100
    },
    containerKeyVisible: {
        alignItems: 'flex-end',
        paddingRight: 20,
        height: '15%'
    },
    containerKeyNotVisible: {
        alignItems: 'center',
        height: '25%'
    },
    containerImg: {
        backgroundColor: colors.palette[1],
        height: '25%'
    }
});