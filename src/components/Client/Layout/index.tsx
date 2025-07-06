import { View } from "react-native"
import { Header } from "../Header"
import { NavBar, NavButtonProps } from "~/components/Navbar"

export type LayoutClientProps = {
    children: React.ReactNode;
    screenActiveScreen: string;
    screenHasHeader?: boolean;
    screenClassNames?: string;
}

export const LayoutClient = ({
    children,
    screenActiveScreen,
    screenHasHeader = true,
    screenClassNames = ''
}: LayoutClientProps) => {
    return (
        <View className='flex-1'>
            {screenHasHeader && <Header />}

            <View className={`flex-1 ${screenClassNames}`}>
                {children}
            </View>

            <NavBar
                activeScreen={screenActiveScreen}
            />
        </View>
    )
}