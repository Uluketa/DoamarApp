import { View, Text } from 'react-native';
import { NavBar } from '~/components/Navbar';

export default function Favorites() {
    return (
        <View className='flex-1 bg-red-300 items-center justify-center mb-0 pb-0'>
            <Text>Favorites</Text>
            <NavBar />
        </View>
    );
}
