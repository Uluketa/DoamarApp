import { ActivityIndicator } from "react-native";

export function Loading() {
    return (
        <ActivityIndicator size="large" className="flex-1 bg-palette-1 items-center justify-center mb-0"/>
    );
}