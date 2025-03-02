import { View, Text } from 'react-native';
import { NavBar } from '~/components/Navbar';

export default function Donation() {
    return (
        <View className='flex-1 bg-purple-300 items-center justify-center mb-0 pb-0'>
            <Text>Donation</Text>
            <NavBar />
        </View>
    );
}
