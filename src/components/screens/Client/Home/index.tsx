import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, FlatList, Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clientHome, listSocialIssues, IMAGE_BASE_URL } from '~/api';
import { useTheme } from '~/contexts/ThemeContext';
import { PATH_CLIENT_PHOTO, PATH_INSTITUTION_COVER } from '~/core/helpers';
import { RootState } from '~/store';
import { setHomeData, setHomeLoading } from '~/store/modules/home/actions';
import { colors } from '~/styles/colors';
import { RootStackParamList } from '~/types/Navigation';
import { Institution } from '~/types/entities/Institution';
import { SocialIssue } from '~/types/entities/SocialIssue';

export default function Home({ searchText = '' }: { searchText?: string }) {
    const dispatch = useDispatch();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const { token, userData } = useSelector((state: RootState) => state.user);
    const { institutions: institutionsData, socialIssues: socialIssuesData, isLoading } = useSelector((state: RootState) => state.home);
    const [userColorRating, setUserColorRating] = useState<string>('#2196F3');

    // Filtrar instituições baseado no texto de busca
    const institutionsFiltered = institutionsData.filter((institution) => {
        const searchLower = searchText.toLowerCase().trim();
        if (!searchLower) return true;
        
        const matchesName = institution.name.toLowerCase().includes(searchLower);
        const matchesSocialIssue = institution.social_issue?.title.toLowerCase().includes(searchLower);
        
        return matchesName || matchesSocialIssue;
    });

    type NavigationProps = StackNavigationProp<RootStackParamList, 'InstitutionProfile'>;
    const navigation = useNavigation<NavigationProps>();
    const { theme, toggleTheme } = useTheme();

    // Handle back button (usa subscription: addEventListener retorna { remove() })
    useEffect(() => {
        const handleBackPress = () => {
            if (isFocused) {
                Alert.alert(
                    "Atenção",
                    "Você realmente deseja sair do aplicativo?",
                    [
                        { text: "Cancelar", onPress: () => null, style: "cancel" },
                        { text: "Sair", onPress: () => BackHandler.exitApp() }
                    ]
                );
                return true;
            }
            return false;
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        return () => subscription.remove();
    }, [isFocused]);

    const fetchData = async () => {
        if (!userData.id || !token) return;
        dispatch(setHomeLoading(true));
        try {
            const [clientHomeResponse, socialIssuesResponse] = await Promise.all([
                clientHome(userData.id, token),
                listSocialIssues(),
            ]);

            const institutions = (clientHomeResponse.ok === 'S' && clientHomeResponse.data?.institutions)
                ? clientHomeResponse.data.institutions
                : [];
            const socialIssues = (socialIssuesResponse.ok === 'S' && socialIssuesResponse.data)
                ? socialIssuesResponse.data
                : [];

            dispatch(setHomeData({ institutions, socialIssues }));
        } catch (error) {
            console.error('Erro ao buscar dados da home:', error);
        } finally {
            dispatch(setHomeLoading(false));
            setIsRefreshing(false);
        }
    };

    // Só busca da API quando ainda não tem dados em cache (ao voltar na Home usa o cache)
    useEffect(() => {
        if (userData.id && token && institutionsData.length === 0 && socialIssuesData.length === 0) {
            dispatch(setHomeLoading(true));
            fetchData();
        }
    }, [userData.id, token]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };

    const handleInstitutionProfile = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    };

    const handleListInstitutions = () => {
        navigation.navigate('ListInstitutions');
    };

    //  Renderizar classificação do usuário
    const renderRating = () => {
        const rating = userData?.classification?.rating;

        if (rating === undefined || rating === null || rating === 0) {
            return (
                <Text className="text-sm text-gray-500">Comece a doar para ganhar pontos</Text>
            );
        }

        let levelText = 'Iniciante';
        let starColor = '#3b82f6';
        let stars = 1;

        if (rating >= 1 && rating <= 2) {
            levelText = 'Nível Iniciante';
            stars = 1;
            starColor = '#3b82f6';
        } else if (rating >= 3 && rating <= 4) {
            levelText = 'Nível Vizinho';
            stars = 2;
            starColor = '#f59e0b';
        } else if (rating >= 5 && rating <= 7) {
            levelText = 'Nível Amigo';
            stars = 3;
            starColor = '#10b981';
        } else if (rating >= 8 && rating <= 9) {
            levelText = 'Nível Herói';
            stars = 4;
            starColor = '#8b5cf6';
        } else if (rating >= 10) {
            levelText = 'Nível Doamar';
            stars = 5;
            starColor = '#ec4899';
        }

        const starIcons = Array(5).fill(0).map((_, i) => (
            <Ionicons
                key={i}
                name={i < stars ? "star" : "star-outline"}
                size={18}
                color={i < stars ? starColor : '#d1d5db'}
            />
        ));

        if (userColorRating !== starColor) {
            setUserColorRating(starColor);
        }

        return (
            <View className='items-center gap-2'>
                <View className='flex-row gap-1'>
                    {starIcons}
                </View>
                <Text className='font-bold text-sm' style={{ color: starColor }}>
                    {levelText}
                </Text>
            </View>
        );
    };

    return (
        <ScrollView
            className='flex-1'
            style={{
                backgroundColor: colors.background
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.border]}
                />
            }
        >
            {/* Header com Perfil */}
            <View className="px-6 pt-8">
                <View className="bg-gradient-to-b items-center pb-8 rounded-2xl" style={{
                    backgroundColor: colors.palette[1] + '15'
                }}>
                    <Image
                        source={require("src/assets/global/cover.png")}
                        className="w-full h-20 absolute top-0 rounded-t-2xl"
                    />

                    <View className="mt-8">
                        <Image
                            source={{
                                uri: userData.client?.pathProfileImage
                                    ? `${IMAGE_BASE_URL}${userData.client.pathProfileImage}`
                                    : `${IMAGE_BASE_URL}${PATH_CLIENT_PHOTO}`
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                borderWidth: 3,
                                borderColor: userColorRating,
                            }}
                        />
                    </View>

                    <Text className="text-2xl font-bold mt-4" style={{ color: colors.text }}>
                        Olá, {userData.client?.name?.split(' ')[0]}!
                    </Text>

                    <View className="mt-2">
                        {renderRating()}
                    </View>
                </View>
            </View>

            {/* Seção de Instituições */}
            <View className="px-6 py-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold" style={{ color: colors.text }}>Instituições</Text>
                    <TouchableOpacity onPress={handleListInstitutions}>
                        <Text className="font-bold text-blue-500">Ver todas</Text>
                    </TouchableOpacity>
                </View>

                {isLoading && institutionsData.length === 0 ? (
                    <View className="h-56 justify-center items-center">
                        <View className="items-center">
                            <ActivityIndicator size="large" color={colors.palette[1]} />
                            <Text className="text-gray-500 mt-4 font-medium">Carregando instituições...</Text>
                            <Text className="text-gray-400 text-sm mt-1">Aguarde um momento</Text>
                        </View>
                    </View>
                ) : institutionsFiltered.length === 0 ? (
                    <View className="h-40 justify-center items-center border border-gray-200 rounded-lg">
                        <Text className="text-gray-500">
                            {searchText.trim() 
                                ? `Nenhuma instituição encontrada para "${searchText}"` 
                                : 'Nenhuma instituição disponível'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={institutionsFiltered}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleInstitutionProfile(item)}
                                className="rounded-2xl overflow-hidden mr-4 bg-white shadow-sm"
                                style={{
                                    width: 160,
                                    height: 200,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                            >
                                {/* Imagem de fundo */}
                                <Image
                                    source={{
                                        uri: item.pathBackgroundImage
                                            ? `${IMAGE_BASE_URL}${item.pathBackgroundImage}`
                                            : `${IMAGE_BASE_URL}${PATH_INSTITUTION_COVER}`
                                    }}
                                    className="w-full h-full"
                                />

                                {/* Gradiente */}
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 80,
                                    }}
                                />

                                {/* Info */}
                                <View className="absolute bottom-0 left-0 right-0 p-3">
                                    <Text className="text-white font-bold text-sm line-clamp-2">
                                        {item.name}
                                    </Text>
                                    {item.social_issue && (
                                        <Text className="text-white/80 text-xs mt-1">
                                            {item.social_issue.title}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Seção de Temas Sociais */}
            <View className="px-6 py-8 border-t" style={{ borderColor: colors.border }}>
                <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>Causas Sociais</Text>

                {isLoading && socialIssuesData.length === 0 ? (
                    <View className="h-24 justify-center items-center">
                        <ActivityIndicator size="large" color={colors.palette[1]} />
                    </View>
                ) : socialIssuesData.length === 0 ? (
                    <Text className="text-gray-500 text-center">Nenhuma causa disponível</Text>
                ) : (
                    <FlatList
                        horizontal
                        data={socialIssuesData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                className="rounded-xl items-center justify-center p-4 mr-3 border"
                                style={{
                                    minWidth: 140,
                                    borderColor: colors.palette[1] + '30'
                                }}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={32}
                                    color={colors.palette[1]}
                                />
                                <Text className="mt-2 text-xs font-semibold text-center" style={{ color: colors.palette[1] }}>
                                    {item.title}
                                </Text>
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Seção de Doações Recentes */}
            <View className="px-6 py-8 border-t" style={{ borderColor: colors.border }}>
                <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>Suas Doações</Text>

                {!userData.donations || userData.donations.length === 0 ? (
                    <View className="bg-blue-50 rounded-lg p-6 items-center">
                        <Ionicons name="gift-outline" size={48} color={colors.palette[1]} />
                        <Text className="mt-4 font-bold text-lg">Comece a Doar</Text>
                        <Text className="text-sm text-gray-600 text-center mt-2">
                            Explore instituições e realize sua primeira doação
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={userData.donations.slice(0, 5)}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item }) => (
                            <View className="rounded-lg border p-4 mr-3" style={{ minWidth: 200, borderColor: colors.border }}>
                                <View className="flex-row items-start gap-3">
                                    <Ionicons name="heart" size={24} color={colors.pink} />
                                    <View className="flex-1">
                                        <Text className="font-bold text-sm line-clamp-2" style={{ color: colors.pink }}>
                                            {item.order?.name || 'Doação'}
                                        </Text>
                                        <Text className="text-xs text-gray-500 mt-1">
                                            {item.order?.institution?.name || 'Instituição'}
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-2">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>

            <View className="h-6" />
        </ScrollView>
    );
}
