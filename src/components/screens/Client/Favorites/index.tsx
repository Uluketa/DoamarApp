import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, Modal } from 'react-native';
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

    const [editMode, setEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const { userData, token } = useSelector((state: RootState) => state.user);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'InstitutionProfile'>;
    const navigation = useNavigation<NavigationProps>();

    const handleInstitutionProfile = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    }

    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setSelectedIds([]);
    };

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
            <View className="flex-row justify-between items-center mx-8 mb-2">
                <Text className="text-2xl font-bold">Favoritos</Text>

                {!editMode ? (
                    <TouchableOpacity onPress={() => setEditMode(true)}>
                        <Text className="text-base font-semibold text-red-600">
                            Editar
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleCancelEdit}>
                        <Text className="text-base font-semibold text-gray-500">
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                transparent
                animationType="fade"
                visible={confirmVisible}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white p-6 rounded-xl w-[80%]">
                        <Text className="text-lg font-bold mb-4">
                            Remover favoritos?
                        </Text>

                        <Text className="text-base text-gray-600 mb-6">
                            Tem certeza que deseja remover {selectedIds.length} favorito(s)?
                        </Text>

                        <View className="flex-row justify-end gap-4">
                            <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                                <Text className="text-gray-500 font-semibold">
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    // 🚀 PAYLOAD PRONTO PRA API
                                    const payload = {
                                        clientId: userData.id,
                                        institutions: selectedIds,
                                    };

                                    console.log('Payload para API:', payload);

                                    setConfirmVisible(false);
                                    handleCancelEdit();
                                }}
                            >
                                <Text className="text-red-600 font-bold">
                                    Remover
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {isLoading ? (
                <View className='flex-row justify-center items-center h-[100%] my-2'>
                    <ActivityIndicator size="large" color={colors.palette[1]} />
                </View>
            ) : (
                <>
                    <FlatList
                        data={favoritesData}
                        keyExtractor={(item) => item.institution.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className={`flex flex-row items-center mt-4 justify-between rounded-xl bg-white elevation-xl mx-8 `}
                                onPress={() => {
                                    if (editMode) {
                                        toggleSelect(item.institution.id);
                                    } else {
                                        handleInstitutionProfile(item.institution);
                                    }
                                }}
                            >
                                <Image
                                    source={{ uri: `http://${URL}${item.institution.pathBackgroundImage}` }}
                                    style={{ width: 110, height: 90 }}
                                    className='rounded-l-xl'
                                />

                                <View className='p-5 rounded-lg m-0 flex-1 justify-between flex-row items-center'>
                                    <Text className="text-lg font-bold">{item.institution.name}</Text>

                                    <Ionicons
                                        name={
                                            editMode
                                                ? selectedIds.includes(item.institution.id)
                                                    ? 'heart-outline'
                                                    : 'heart'
                                                : 'heart'
                                        }
                                        size={30}
                                        color={'gray'}
                                    />
                                </View>

                            </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />

                    {editMode && selectedIds.length > 0 && (
                        <View className="absolute bottom-6 left-0 right-0 items-center">
                            <TouchableOpacity
                                className="bg-red-600 px-8 py-4 rounded-full"
                                onPress={() => setConfirmVisible(true)}
                            >
                                <Text className="text-white font-bold text-lg">
                                    Remover ({selectedIds.length})
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}
