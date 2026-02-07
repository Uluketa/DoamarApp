import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { listSocialIssues } from '~/api';
import { RootStackParamList } from '~/types/Navigation';
import { colors } from '~/styles/colors';
import { SocialIssue } from '~/types/entities/SocialIssue';

export default function ListSocialIssuesScreen() {
    const [socialIssuesData, setSocialIssuesData] = useState<SocialIssue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    type NavigationProps = StackNavigationProp<RootStackParamList, 'ListSocialIssues'>;
    const navigation = useNavigation<NavigationProps>();

    const handleSelectSocialIssue = (socialIssue: SocialIssue) => {
        navigation.navigate('ListInstitutions', { socialIssueId: socialIssue.id });
    };

    const fetchSocialIssues = async () => {
        try {
            const response = await listSocialIssues();
            if (response.ok === 'S' && response.data) {
                setSocialIssuesData(response.data);
            }
        } catch (error: any) {
            console.error('Erro ao buscar causas sociais:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSocialIssues();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSocialIssues();
    };

    const visibleData = useMemo(() => {
        const q = query.trim().toLowerCase();
        return socialIssuesData.filter((issue) =>
            q ? issue.title.toLowerCase().includes(q) : true
        );
    }, [socialIssuesData, query]);

    const renderItem = ({ item }: { item: SocialIssue }) => (
        <TouchableOpacity
            onPress={() => handleSelectSocialIssue(item)}
            className="mx-4 my-2 p-4 rounded-xl flex-row items-center"
            style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                elevation: 3,
            }}
        >
            {item.icon && (
                <View className="mr-4 p-3 rounded-lg" style={{ backgroundColor: colors.palette[1] + '20' }}>
                    <Ionicons name={item.icon as any} size={28} color={colors.palette[1]} />
                </View>
            )}

            <View className="flex-1">
                <Text className="text-base font-bold" style={{ color: colors.text }}>
                    {item.title}
                </Text>
                <Text className="text-sm mt-1" style={{ color: colors.text + 'CC' }}>
                    {item.description}
                </Text>
            </View>

            <Ionicons name="chevron-forward-outline" size={20} color={colors.palette[1]} />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="px-4 pt-4 pb-4">
                <View
                    className="flex-row items-center rounded-xl px-3 h-10"
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
                        placeholder="Buscar causas..."
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
            </View>

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
                                Nenhuma causa encontrada
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
