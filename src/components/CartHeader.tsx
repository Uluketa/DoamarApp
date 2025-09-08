import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';
import { RootStackParamList } from '~/types/Navigation';

type CartProps = {
    classlist?: string;
}

export const CartHeader = ({ classlist = '' }: CartProps) => {
    const { items } = useSelector((state: RootState) => state.cart);

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const displayQuantity = totalQuantity > 9 ? '9+' : totalQuantity;

    type NavigationProps = StackNavigationProp<RootStackParamList, 'Layout'>;
    const navigation = useNavigation<NavigationProps>();

    const handleOpenCart = () => {
        navigation.navigate("ClientCart");
    }

    return (
        <Pressable className={`relative px-2 ${classlist}`} onPress={handleOpenCart}>
            <Ionicons name="cart" size={25} color="white" />

            {totalQuantity > 0 && (
                <View
                    className='absolute bg-red-600 items-center justify-center z-10 px-1 rounded-full'
                    style={{
                        top: -4,
                        right: -6,
                        minWidth: 16,
                        height: 16,
                    }}
                    pointerEvents="none"
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: '700',
                            lineHeight: 12,
                        }}
                    >
                        {displayQuantity}
                    </Text>
                </View>

            )}
        </Pressable>
    );
};