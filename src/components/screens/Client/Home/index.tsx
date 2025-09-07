import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clientHome, listSocialIssues, URL } from '~/api';
import { PATH_CLIENT_PHOTO, PATH_INSTITUTION_COVER } from '~/core/helpers';
import { RootState } from '~/store';
import { colors } from '~/styles/colors';
import { RootStackParamList } from '~/types/Navigation';
import { Institution } from '~/types/entities/Institution';
import { SocialIssue } from '~/types/entities/SocialIssue';

export default function Home() {
    const dispatch = useDispatch();
    const [institutionsData, setInstitutionsData] = useState<Array<Institution>>([]);
    const [socialIssuesData, setSocialIssuesData] = useState<Array<SocialIssue>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isFocused = useIsFocused();

    const { token, userData } = useSelector((state: RootState) => state.user);
    const [userColorRating, setUserColorRating] = useState<string>('#2196F3');

    type NavigationProps = StackNavigationProp<RootStackParamList, 'InstitutionProfile'>;
    const navigation = useNavigation<NavigationProps>();

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

        BackHandler.addEventListener("hardwareBackPress", handleBackPress);

        return () => {
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        };
    }, [isFocused]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const clientHomeResponse = await clientHome(userData.id, token);
            const clientHomeData = clientHomeResponse.data;

            if (!userData) dispatch({ type: 'user/setUserData', payload: clientHomeData.user });
            setInstitutionsData(clientHomeData.institutions);

            const socialIssuesResponse = await listSocialIssues();
            const socialIssuesData = socialIssuesResponse.data;

            setSocialIssuesData(socialIssuesData);

        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };

    const handleInstitutionProfile = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    }

    const renderRating = () => {
        const rating = userData?.classification?.rating;

        if (rating === undefined || rating === null || rating === 0) {
            return (
                <Text style={{ color: 'gray', fontSize: 12 }}>Sem histórico de doações</Text>
            );
        }

        let levelText = 'Iniciante';
        let starSize = 15;
        let nameStyle = {};
        let stars = 0;
        let starColor = '#2196F3';

        if (rating >= 1 && rating <= 3) {
            levelText = 'Nível Iniciante';
            stars = Math.ceil(rating / 2);

        } else if (rating >= 4 && rating <= 6) {
            starColor = '#ffa200ff';
            levelText = 'Nível Vizinho';
            stars = Math.ceil(rating / 2);

        } else if (rating >= 7 && rating <= 9) {
            starColor = colors.palette[3];
            levelText = 'Nível Amigo';
            stars = Math.ceil(rating / 2);

        } else if (rating === 10) {
            starColor = '#8e24aa';
            levelText = 'Nível Doamar';
            starSize = 22;
            nameStyle = { color: '#8e24aa' };
            stars = 5;
        }

        // Gera estrelas cheias
        const starIcons = [];
        for (let i = 0; i < 5; i++) {
            starIcons.push(
                <Ionicons
                    key={i}
                    name="star"
                    size={starSize}
                    color={i < stars ? starColor : 'gray'}
                />
            );
        }

        if (userColorRating !== starColor) {
            setUserColorRating(starColor);
        }

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                {starIcons}
                <Text style={{ marginLeft: 8, color: starColor, fontWeight: 'bold', fontSize: 13 }}>{levelText}</Text>
            </View>
        );
    };

    return (
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* Perfil */}
            <View
                className='flex-row items-center m-4 rounded-xl justify-between p-4 '
            >
                <View>
                    {renderRating()}
                    <Text className='text-3xl font-semibold my-2' style={userData?.classification?.rating === 10 ? { color: userColorRating } : {}}>{userData.client?.name}</Text>
                    <Text className='text-md text-gray-500'>
                        {userData.client?.accountType === 'B' ?
                            'Doador & Recebedor' : userData.client?.accountType === 'D' ?
                                'Doador' : 'Recebedor'}
                    </Text>
                </View>

                <View className='flex flex-row items-center'>
                    <Image
                        source={{ uri: `http://${URL}${userData.client?.pathProfileImage ? userData.client.pathProfileImage : PATH_CLIENT_PHOTO}` }}
                        className='rounded-full'
                        style={{
                            borderColor: (userData?.classification?.rating === 10) ? userColorRating : colors.palette[1],
                            borderWidth: (userData?.classification?.rating === 10) ? 3 : 2,
                            width: 80,
                            height: 80
                        }}
                    />
                </View>
            </View>

            {/* Instituições */}
            <View className='pl-4 pb-6'>
                <View className='flex flex-row justify-between items-center mr-4'>
                    <Text className='text-2xl font-bold mb-2'>Instituições</Text>
                    <Text className='font-bold underline' style={{ color: colors.palette[1] }}>Ver mais</Text>
                </View>
                {isLoading ? (
                    <View className='flex-row justify-center items-center h-[150] my-2'>
                        <ActivityIndicator size="large" color={colors.palette[1]} />
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={institutionsData}
                        renderItem={({ item }) => (
                            <View
                                className="rounded-xl mr-2 overflow-hidden relative"
                                style={{ overflow: 'hidden' }}
                            >
                                <Pressable
                                    onPress={() => handleInstitutionProfile(item)}
                                    className="z-10 absolute top-2 right-2 w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center">
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </Pressable>

                                <Image
                                    source={{ uri: `http://${URL}${item.pathBackgroundImage ? item.pathBackgroundImage : PATH_INSTITUTION_COVER}` }}
                                    style={{ width: 140, height: 150 }}
                                />

                                {/* Gradiente */}
                                <LinearGradient
                                    colors={['transparent', colors.palette[0]]}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 100,
                                    }}
                                />

                                {/* Texto Centralizado */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        left: 0,
                                        right: 0,
                                        height: 100,
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text className="text-center text-md text-white">{item.name}</Text>
                                </View>
                            </View>
                        )}
                        className='space-x-3 h-[150] my-2'
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Imagem de Propaganda */}
            <View className="relative overflow-hidden">
                <Image
                    className="opacity-40 w-full h-48"
                    source={require("src/assets/rostos.jpg")}
                />

                <Image
                    className="absolute w-24 h-24 items-center content-center"
                    source={require("src/assets/logoDarkGreenA.png")}
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: [{ translateX: -48 }, { translateY: -48 }],
                    }}
                />
            </View>

            {/* Questões Sociais */}
            <View className='pl-4 py-6'>
                <Text className='text-2xl font-bold mb-2'>Questões Sociais</Text>

                {isLoading ? (
                    <View className='flex-row justify-center items-center h-[70] my-2'>
                        <ActivityIndicator size="large" color={colors.palette[1]} />
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={socialIssuesData}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <Pressable
                                className="flex flex-row items-center mr-2 justify-center rounded-xl"
                                style={{
                                    backgroundColor: colors.palette[0]
                                }}
                            >
                                <View className='p-5 rounded-lg m-0'>
                                    <Ionicons name={item.icon} size={30} color={colors.palette[4]} />
                                </View>

                                <Text className="text-center text-md pr-5" style={{ color: colors.palette[4] }}>{item.title}</Text>
                            </Pressable>
                        )}
                        className='h-[70] my-2'
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Doações Realizadas */}
            <View className='pl-4 py-6'>
                <Text className='text-2xl font-bold mb-2'>Doações Realizadas</Text>

                {isLoading ? (
                    <View className='flex-row justify-center items-center h-[100] my-2'>
                        <ActivityIndicator size="large" color={colors.palette[1]} />
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        data={userData.donations || []}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                className="rounded-xl mr-2 overflow-hidden bg-white shadow-md"
                                style={{ width: 200, padding: 10 }}
                            >
                                <Text className="text-lg font-semibold mb-1">{item.order?.name || 'Pedido'}</Text>
                                <Text className="text-sm text-gray-500 mb-2">
                                    {item.order?.description || 'Sem descrição'}
                                </Text>
                                <Text className="text-sm font-bold">
                                    Data: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                </Text>
                            </View>
                        )}
                        className='my-2 p-2'
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>
        </ScrollView>
    );
}
