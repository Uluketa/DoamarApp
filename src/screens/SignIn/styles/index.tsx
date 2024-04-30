import { StyleSheet } from "react-native";
import { colors } from "~/styles/colors";

export const styles = StyleSheet.create({
    imgKeyVisible: {
        width: 50,
        height: 50
    },
    imgKeyNotVisible: {
        width: 100,
        height: 100
    },
    containerKeyVisible: {
        alignItems: 'flex-end',
        paddingRight: 20
    },
    containerKeyNotVisible: {
        alignItems: 'center'
    },
    containerImg: {
        backgroundColor: colors.palette[1],
        height: '25%'
    }
});