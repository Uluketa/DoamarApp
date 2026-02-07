import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch
} from 'react-native';
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

    // UI filter states
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [hasLogoOnly, setHasLogoOnly] = useState(false);
    const [sortAZ, setSortAZ] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { userData, token } = useSelector((state: RootState) => state.user);
    const route = useRoute();
    const params = route.params as { socialIssueId?: number } | undefined;
    const socialIssueFilterId = params?.socialIssueId;

    type NavigationProps = StackNavigationProp<RootStackParamList, 'ListInstitutions'>;
    const navigation = useNavigation<NavigationProps>();

    const handleInstitutionProfile = (institution: Institution) => {
        navigation.navigate('InstitutionProfile', { institution });
    };

    const fetchClientFavorites = async () => {
        try {
            const response = await indexInstitutions(token);
            setInstitutionsData(response.data);
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchClientFavorites();
    }, [userData.id]);

    useEffect(() => {
        // Atualizar título quando há filtro de causa social
        if (socialIssueFilterId && institutionsData.length > 0) {
            const causaName = institutionsData.find(i => i.social_issue?.id === socialIssueFilterId)?.social_issue?.title || 'Causa Social';
            navigation.setOptions({
                title: causaName
            });
        }
    }, [socialIssueFilterId, institutionsData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchClientFavorites();
    };

    const visibleData = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = institutionsData.filter((it) => {
            const matchQuery = q ? it.name.toLowerCase().includes(q) : true;
            const matchLogo = hasLogoOnly ? Boolean(it.pathLogoImage) : true;
            const matchSocialIssue = socialIssueFilterId ? it.social_issue?.id === socialIssueFilterId : true;
            return matchQuery && matchLogo && matchSocialIssue;
        });

        list = list.sort((a, b) => {
            if (a.name && b.name) {
                return sortAZ ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            return 0;
        });

        return list;
    }, [institutionsData, query, hasLogoOnly, sortAZ, socialIssueFilterId]);

    const renderItem = ({ item }: { item: Institution }) => (
        <TouchableOpacity
            onPress={() => handleInstitutionProfile(item)}
            className="mx-4 my-2 flex-row items-center rounded-xl overflow-hidden"
            style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                elevation: 3,
            }}
        >
            <Image
                source={{
                    uri: `http://${URL}${item.pathBackgroundImage || PATH_INSTITUTION_COVER}`,
                }}
                className="w-[110px] h-[90px]"
                resizeMode="cover"
            />

            <View className="flex-1 p-3 justify-between">
                <Text
                    className="text-base font-bold"
                    style={{ color: colors.text }}
                    numberOfLines={2}
                >
                    {item.name}
                </Text>

                <View className="flex-row items-center justify-end mt-2">
                    {item.pathLogoImage ? (
                        <Image
                            source={{ uri: `http://${URL}${item.pathLogoImage}` }}
                            className="w-16 h-12 rounded-lg"
                            resizeMode="contain"
                        />
                    ) : (
                        <View
                            className="w-12 h-12 rounded-lg items-center justify-center"
                            style={{ backgroundColor: colors.border }}
                        >
                            <Ionicons name="chevron-forward-outline" size={20} color={colors.palette[1]} />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="px-4 pt-4 flex-row items-center gap-2 pb-4">
                <View
                    className="flex-1 flex-row items-center rounded-xl px-3 h-full"
                    style={{
                        backgroundColor: colors.background || '#ffffff10',
                        borderColor: colors.borderSecondary,
                        borderWidth: 1,
                    }}
                >
                    <Ionicons name="search" size={18} color={colors.borderSecondary} />

                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Buscar instituições..."
                        placeholderTextColor={colors.borderSecondary}
                        className="flex-1 ml-2 h-10"
                        style={{ color: colors.text, fontFamily: 'Poppins-Regular' }}
                    />

                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color={colors.borderSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => setShowFilters((s) => !s)}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: colors.primary }}
                >
                    <Ionicons name="filter" size={20} color="#fff" />
                </TouchableOpacity>
            </View>


            {showFilters && (
                <View className="px-4 py-2 flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                        <Text style={{ color: colors.text }}>Com logo</Text>
                        <Switch
                            value={hasLogoOnly}
                            onValueChange={setHasLogoOnly}
                            trackColor={{ true: colors.palette[1] }}
                        />
                    </View>

                    <View className="flex-row items-center gap-2">
                        <Text style={{ color: colors.text }}>Ordenar A-Z</Text>
                        <Switch
                            value={sortAZ}
                            onValueChange={setSortAZ}
                            trackColor={{ true: colors.palette[1] }}
                        />
                    </View>
                </View>
            )}

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={colors.palette[1]} />
                </View>
            ) : (
                <FlatList
                    data={visibleData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.palette[1]}
                        />
                    }
                    ListEmptyComponent={
                        <View className="py-10 items-center">
                            <Ionicons name="search-circle" size={48} color={colors.border} />
                            <Text className="mt-2" style={{ color: colors.text }}>
                                Nenhuma instituição encontrada
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}