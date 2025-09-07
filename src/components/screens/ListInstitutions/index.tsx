import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { indexInstitutions, URL } from '~/api';
import { RootState } from '~/store';
import { Institution } from '~/types/entities/Institution';
import { RootStackParamList } from '~/types/Navigation';
import { colors } from '~/styles/colors';
import { PATH_INSTITUTION_COVER } from '~/core/helpers';

export default function ListInstitutions() {
    const [institutionsData, setInstitutionsData] = useState<Array<Institution>>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { userData, token } = useSelector((state: RootState) => state.user);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'InstitutionProfile'>;
    const navigation = useNavigation<NavigationProps>();

    const handleInstitutionProfile = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    }

    const fetchClientFavorites = async () => {
        try {
            const response = await indexInstitutions(token);
            setInstitutionsData(response.data);

        } catch (error: any) {
            console.log(error)
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchClientFavorites();
    }, [userData.id]);

    return (
        <View className='flex-1'>
            {isLoading ? (
                <View className='flex-row justify-center items-center h-[100%] my-2'>
                    <ActivityIndicator size="large" color={colors.palette[1]} />
                </View>
            ) : (
                <FlatList
                    data={institutionsData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex flex-row items-center my-2 justify-between rounded-xl bg-white elevation-xl mx-8"
                            onPress={() => handleInstitutionProfile(item)}
                        >
                            <Image
                                source={{ uri: `http://${URL}${item.pathBackgroundImage ? item.pathBackgroundImage : PATH_INSTITUTION_COVER}` }}
                                style={{ width: 110, height: 90 }}
                                className='rounded-l-xl'
                            />

                            <View className='p-5 rounded-lg m-0 flex-1 justify-between flex-row items-center'>
                                <Text className="text-lg font-bold">{item.name}</Text>

                                {item.pathLogoImage &&
                                    <Image
                                        source={{ uri: `http://${URL}${item.pathLogoImage}` }}
                                        style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                        className='rounded-l-xl'

                                    />
                                }
                            </View>

                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </View>
    );
}
