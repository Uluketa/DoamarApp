import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getClientFavorites, URL } from '~/api';
import { RootState } from '~/store';
import { Institution } from '~/types/entities/Institution';
import { RootStackParamList } from '~/types/Navigation';
import { ClientFavorite } from '~/types/entities/ClientFavorite';
import { colors } from '~/styles/colors';

export default function Favorites() {
    const [favoritesData, setFavoritesData] = useState<Array<ClientFavorite>>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { userData, token } = useSelector((state: RootState) => state.user);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'InstitutionProfile'>;
    const navigation = useNavigation<NavigationProps>();

    const handleInstitutionProfile = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    }

    const fetchClientFavorites = async () => {
        try {
            const response = await getClientFavorites(userData.id, token);
            setFavoritesData(response.data);

        } catch (error: any) {
            console.log(error)
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchClientFavorites();
    }, [userData.id]);

    return (
        <View className='flex-1 py-10'>
            <Text className='text-2xl mx-8 font-bold mb-2'>Favoritos</Text>

            {isLoading ? (
                <View className='flex-row justify-center items-center h-[100%] my-2'>
                    <ActivityIndicator size="large" color={colors.palette[1]} />
                </View>
            ) : (
                <FlatList
                    data={favoritesData}
                    keyExtractor={(item) => item.institution.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex flex-row items-center mt-4 justify-between rounded-xl bg-white elevation-xl mx-8"
                            onPress={() => handleInstitutionProfile(item.institution)}
                        >
                            <Image
                                source={{ uri: `http://${URL}${item.institution.pathBackgroundImage}` }}
                                style={{ width: 110, height: 90 }}
                                className='rounded-l-xl'
                            />

                            <View className='p-5 rounded-lg m-0 flex-1 justify-between flex-row items-center'>
                                <Text className="text-lg font-bold">{item.institution.name}</Text>

                                <Ionicons name="heart" size={30} color="red" />
                            </View>

                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </View>
    );
}
