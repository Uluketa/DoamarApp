import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { LayoutClient } from '~/components/Client/Layout';
import { getClientFavorites, URL } from '~/services/api';
import { RootState } from '~/store';
import { ClientType } from '~/types/client';
import { InstitutionType } from '~/types/institution';
import { RootStackParamList } from '~/types/navigation';

type ClientFavoritesType = {
    client: ClientType,
    institution: InstitutionType,
    active: "1" | "0"
}

export default function Favorites() {
    const [favoritesData, setFavoritesData] = useState<Array<ClientFavoritesType>>([]);
    const { userId } = useSelector((state: RootState) => state.user);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'CompanyProfile'>;
    const navigation = useNavigation<NavigationProps>();

    const handleInstitutionProfile = (institution: InstitutionType) => {
        navigation.navigate('CompanyProfile', { companyName: institution.name, companyId: institution.id });
    }

    const fetchClientFavorites = async () => {
        try {
            const response = await getClientFavorites(userId);
            setFavoritesData(response);

        } catch (error: any) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchClientFavorites();
    }, [userId]);

    return (
        <LayoutClient
            screenActiveScreen='ClientFavorites'
            screenClassNames='py-8'
        >
            <Text className='text-2xl mx-8 font-bold mb-2'>Favoritos</Text>

            <FlatList
                data={favoritesData}
                keyExtractor={(item) => item.institution.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="flex flex-row items-center mt-4 justify-between rounded-xl bg-white elevation-xl mx-8"
                        onPress={() => handleInstitutionProfile(item.institution)}
                    >
                        <Image
                            source={{ uri: `http://${URL}${item.institution.background}` }}
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
        </LayoutClient>
    );
}
