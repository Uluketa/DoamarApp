import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getClientFavorites, addFavorite, removeFavorite, IMAGE_BASE_URL } from '~/api';
import { PATH_INSTITUTION_COVER } from '~/core/helpers';
import { RootState } from '~/store';
import { Institution } from '~/types/entities/Institution';
import { RootStackParamList } from '~/types/Navigation';
import { ClientFavorite } from '~/types/entities/ClientFavorite';
import { colors } from '~/styles/colors';
import Toast from 'react-native-toast-message';

export default function Favorites() {
    const [favoritesData, setFavoritesData] = useState<Array<ClientFavorite>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [removingIds, setRemovingIds] = useState<number[]>([]);

    const { userData, token } = useSelector((state: RootState) => state.user);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'InstitutionProfile'>;
    const navigation = useNavigation<NavigationProps>();

    // Buscar favoritos
    const fetchClientFavorites = async () => {
        try {
            const response = await getClientFavorites(userData.client?.id || 0, token);

            if (response.ok === 'S' && response.data) {
                setFavoritesData(response.data);
            } else {
                setFavoritesData([]);
            }
        } catch (error: any) {
            console.error('Erro ao buscar favoritos:', error);
            setFavoritesData([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchClientFavorites();
        }, [userData.id, token])
    );

    // Adicionar favorito
    const handleAddFavorite = async (institutionId: number) => {
        try {
            const response = await addFavorite(userData.client?.id || 0, institutionId, token);

            if (response.ok === 'S') {
                // Refrescar lista
                await fetchClientFavorites();
                Toast.show({
                    type: 'success',
                    text1: 'Adicionado aos favoritos!',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: response.msg || 'Não foi possível adicionar aos favoritos.'
                });
            }
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao adicionar aos favoritos.'
            });
        }
    };

    // Remover favorito
    const handleRemoveFavorite = async (clientId: number, institutionId: number) => {
        setRemovingIds([...removingIds, institutionId]);

        try {
            const response = await removeFavorite(clientId, institutionId, token);

            if (response.ok === 'S') {
                // Remover da lista localmente
                setFavoritesData(prev => prev.filter(fav => fav.institution.id !== institutionId));
                Toast.show({
                    type: 'success',
                    text1: 'Removido dos favoritos!'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: response.msg || 'Não foi possível remover dos favoritos.'
                });
            }
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Erro ao remover dos favoritos.'
            });
        } finally {
            setRemovingIds(removingIds.filter(id => id !== institutionId));
        }
    };

    const handleNavigateToInstitution = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchClientFavorites();
    };

    if (isLoading) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="large" color={colors.palette[1]} />
            </View>
        );
    }

    return (
        <View className='flex-1 py-6' style={{ backgroundColor: colors.background }}>
            <View className="flex-row justify-between items-center mx-6 mb-4">
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                    Favoritos {favoritesData.length > 0 && `(${favoritesData.length})`}
                </Text>
            </View>

            {favoritesData.length === 0 ? (
                <View className='flex-1 justify-center items-center'>
                    <Text className="text-center mt-4 text-gray-500 text-lg" style={{ color: colors.text }}>
                        Nenhum favorito{'\n'}adicione suas instituições favoritas!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={favoritesData}
                    keyExtractor={(item) => item.institution.id.toString()}
                    renderItem={({ item }) => (
                        <View className="mx-6 mb-4 rounded-xl overflow-hidden shadow-sm border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => handleNavigateToInstitution(item.institution)}
                                className="flex-row items-center"
                            >
                                {/* Imagem da Instituição */}
                                <Image
                                    source={{
                                        uri: item.institution.pathBackgroundImage
                                            ? `${IMAGE_BASE_URL}${item.institution.pathBackgroundImage}`
                                            : `${IMAGE_BASE_URL}${PATH_INSTITUTION_COVER}`
                                    }}
                                    style={{ width: 120, height: 100 }}
                                    className='rounded-l-xl'
                                />

                                {/* Informações */}
                                <View className='flex-1 px-4 py-4'>
                                    <Text className="text-base font-bold mb-1" style={{ color: colors.text }}>
                                        {item.institution.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500" numberOfLines={1}>
                                        {item.institution.social_issue?.title || 'Sem categorização'}
                                    </Text>
                                </View>

                                {/* Botão Favoritar/Remover */}
                                <View className='pr-4'>
                                    {removingIds.includes(item.institution.id) ? (
                                        <ActivityIndicator size="small" color={colors.palette[1]} />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleRemoveFavorite(item.client.id, item.institution.id)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons
                                                name="heart"
                                                size={28}
                                                color={colors.palette[1]}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[colors.palette[1]]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
