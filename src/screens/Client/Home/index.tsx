import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, BackHandler, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { LayoutClient } from '~/components/Client/Layout';
import { listHomeClient, listSocialIssues, URL } from '~/services/api';
import { RootState } from '~/store';
import { colors } from '~/styles/colors';
import { AccountType } from '~/types/accountType';
import { RootStackParamList } from '~/types/navigation';

type InstitutionDataType = { id: number, name: string, image: string | null };
type ClientDataType = { accountType: AccountType, name: string, profileImage: string | null };

export default function Home() {
    const [clientData, setClientData] = useState<ClientDataType>({ accountType: 'D', name: '', profileImage: '' });
    const [institutionsData, setInstitutionsData] = useState<Array<InstitutionDataType>>([]);
    const [socialIssuesData, setSocialIssuesData] = useState<Array<{ description: string, icon: keyof typeof Ionicons.glyphMap, title: string }>>([]);
    const isFocused = useIsFocused();

    const { userId } = useSelector((state: RootState) => state.user);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'CompanyProfile'>;
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
            BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        };
    }, [isFocused]);

    useEffect(() => {
        fetchHome();
        fetchSocialIssues();
    }, []);

    const fetchSocialIssues = async () => {
        try {
            const { data } = await listSocialIssues();
            setSocialIssuesData(data);

        } catch (error) {
            console.log(error)
        }
    }

    const fetchHome = async () => {
        try {
            const { data } = await listHomeClient(userId);
            setInstitutionsData(data.institutions)
            setClientData(data.client)

        } catch (error) {
            console.log(error)
        }
    }

    const handleInstitutionProfile = (institution: InstitutionDataType) => {
        navigation.navigate('CompanyProfile', { companyName: institution.name, companyId: institution.id });
    }

    return (
        <LayoutClient
            screenActiveScreen='ClientHome'
        >
            <ScrollView className='flex-1 mb-20' showsVerticalScrollIndicator={false}>
                {/* Perfil */}
                <View
                    className='flex-row items-center m-4 rounded-xl justify-between p-4 '
                >
                    <View className=''>
                        <Text>
                            <Ionicons name="star" size={15} color="black" />
                            <Ionicons name="star" size={15} color="black" />
                            <Ionicons name="star" size={15} color="black" />
                            <Ionicons name="star" size={15} color="black" />
                            <Ionicons name="star" size={15} color="gray" />
                        </Text>
                        <Text className='text-3xl font-semibold my-2'>{clientData.name}</Text>
                        <Text className='text-md text-gray-500'>{
                            clientData.accountType === 'B' ?
                                'Doador & Recebedor' : clientData.accountType === 'D' ?
                                    'Doador' : 'Recebedor'
                        }</Text>
                    </View>

                    <View className='flex flex-row items-center'>
                        <Image
                            source={{ uri: `http://${URL}${clientData.profileImage}` }}
                            className='rounded-full'
                            style={{
                                borderColor: colors.palette[1],
                                borderWidth: 2,
                                width: 60,
                                height: 60
                            }}
                        />
                    </View>
                </View>

                {/* Instituições */}
                <View className='pl-4 pb-6 pt-3'>
                    <View className='flex flex-row justify-between items-center mr-4'>
                        <Text className='text-2xl font-bold mb-2'>Instituições</Text>
                        <Text className='font-bold' style={{ color: colors.palette[1] }}>Ver mais</Text>
                    </View>
                    <FlatList
                        horizontal
                        data={institutionsData}
                        renderItem={({ item }) => (
                            <View
                                className="rounded-xl mr-2 overflow-hidden my-2 relative"
                                style={{ overflow: 'hidden' }}
                            >
                                <TouchableOpacity
                                    onPress={() => handleInstitutionProfile(item)}
                                    className="z-10 absolute top-2 right-2 w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center">
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </TouchableOpacity>

                                <Image
                                    source={{ uri: `http://${URL}${item.image}` }}
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
                        className='space-x-3'
                        showsHorizontalScrollIndicator={false}
                    />
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
                    <FlatList
                        horizontal
                        data={socialIssuesData}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="flex flex-row items-center mr-2 justify-center rounded-xl"
                                style={{
                                    backgroundColor: colors.palette[1]
                                }}
                            >
                                <View className='p-5 rounded-lg m-0' style={{ backgroundColor: colors.palette[1] }}>
                                    <Ionicons name={item.icon} size={30} color={colors.palette[4]} />
                                </View>

                                <Text className="text-center text-md pr-5" style={{ color: colors.palette[4] }}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                {/* Doações Realizadas */}
                <View className='pl-4 py-6'>
                    <Text className='text-2xl font-bold mb-2'>Doações Realizadas</Text>
                </View>
            </ScrollView>
        </LayoutClient>
    );
}
