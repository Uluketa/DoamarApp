import { useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';

import { RootStackParamList } from '~/types/Navigation';
import { colors } from '~/styles/colors';
import { Institution } from '~/types/entities/Institution';
import { Order } from '~/types/entities/Order';
import { RootState } from '~/store';

import { getOrdersByInstitution, resolveImageUrl, getClientFavorites, addFavorite, removeFavorite } from '~/api';
import { formatCNPJ, PATH_INSTITUTION_COVER } from '~/core/helpers';
import { OrderCard } from './components/OrderCard';
import { CartHeader } from '~/components/CartHeader';
import { setCartItems, clearCart } from '~/store/modules/cart/actions';
import { useTheme } from '~/contexts/ThemeContext';

const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
];

type Props = StackScreenProps<RootStackParamList, 'InstitutionProfile'>;

export function InstitutionProfile({ route, navigation }: Props) {
  const { institution } = route.params;
  const [institutionData] = useState<Institution>(institution);
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const { theme } = useTheme();

  const dispatch = useDispatch();
  const { token, userData } = useSelector((state: RootState) => state.user);
  const { items, institution: cartInstitution } = useSelector(
    (state: RootState) => state.cart
  );

  const [location, setLocation] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
  });

  const [mapRegion, setMapRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const institutionAddress = useMemo(() => {
    const parts = [
      institutionData.addressLine,
      institutionData.addressNumber,
      institutionData.addressNeighborhood,
      institutionData.addressCity,
      institutionData.addressState,
      institutionData.addressCep,
    ].filter(Boolean);

    if (parts.length > 0) {
      return `${parts.join(', ')}, Brasil`;
    }

    return '';
  }, [
    institutionData.addressLine,
    institutionData.addressNumber,
    institutionData.addressNeighborhood,
    institutionData.addressCity,
    institutionData.addressState,
    institutionData.addressCep,
  ]);

  const fallbackCepQuery = useMemo(() => {
    if (!institutionData.addressCep) return '';
    const cep = String(institutionData.addressCep).replace(/\D/g, '');
    return cep ? `${cep}, Brasil` : '';
  }, [institutionData.addressCep]);

  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const clientId = userData.client?.id || 0;
  const getQuantityForOrder = (orderId: number) =>
    items.find(i => i.id === orderId)?.quantity ?? 0;

  const handleQuantityChange = (order: Order, qty: number) => {
    const differentInstitution =
      cartInstitution && cartInstitution.id !== institutionData.id;

    if (differentInstitution) {
      Alert.alert(
        'Carrinho de outra instituição',
        'Deseja limpar o carrinho para adicionar este item?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Limpar e adicionar',
            onPress: () => {
              dispatch(clearCart());
              dispatch(
                setCartItems({
                  institution: institutionData,
                  items: qty > 0 ? [{ ...order, quantity: qty }] : [],
                })
              );
            },
          },
        ]
      );
      return;
    }

    dispatch(
      setCartItems({
        institution: institutionData,
        items: items
          .filter(i => i.id !== order.id)
          .concat(qty > 0 ? [{ ...order, quantity: qty }] : []),
      })
    );
  };

  const fetchOrders = async () => {
    const response = await getOrdersByInstitution(institutionData.id, token);
    if (response.data) setOrdersData(response.data);
  };

  // Buscar lista de favoritos do cliente
  const fetchFavorites = useCallback(async () => {
    if (!token || !clientId) return;

    try {
      const response = await getClientFavorites(clientId, token);
      if (response.ok === 'S' && response.data) {
        // Verificar se a instituição atual está na lista de favoritos
        const isFavorite = response.data.some(
          (fav: any) => fav.institution_id === institutionData.id
        );
        setLiked(isFavorite);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  }, [token, clientId, institutionData.id]);

  // Lidar com favoritar/desfavoritar
  const handleToggleFavorite = useCallback(async () => {
    if (!token || !clientId) {
      Alert.alert('Erro', 'Você precisa estar logado para favoritar');
      return;
    }

    setLikeLoading(true);
    try {
      if (liked) {
        // Remover favorito
        const response = await removeFavorite(clientId, institutionData.id, token);
        if (response.ok === 'S') {
          setLiked(false);
        } else {
          Alert.alert('Erro', response.msg || 'Erro ao remover favorito');
        }
      } else {
        // Adicionar favorito
        const response = await addFavorite(clientId, institutionData.id, token);
        if (response.ok === 'S') {
          setLiked(true);
        } else {
          Alert.alert('Erro', response.msg || 'Erro ao adicionar favorito');
        }
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao processar favorito');
      console.error('Erro ao processar favorito:', error);
    } finally {
      setLikeLoading(false);
    }
  }, [liked, token, clientId, institutionData.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    if (!institutionAddress && !fallbackCepQuery) return;

    let cancelled = false;
    const geocode = async () => {
      try {
        let results = institutionAddress
          ? await Location.geocodeAsync(institutionAddress)
          : [];

        if ((!results || results.length === 0) && fallbackCepQuery) {
          results = await Location.geocodeAsync(fallbackCepQuery);
        }

        if (!cancelled && results.length > 0) {
          const nextLocation = {
            latitude: results[0].latitude,
            longitude: results[0].longitude,
          };
          setLocation(nextLocation);
          setMapRegion({
            ...nextLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.warn('Falha ao geocodificar endereco:', error);
      }
    };

    geocode();

    return () => {
      cancelled = true;
    };
  }, [institutionAddress, fallbackCepQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => <CartHeader classlist="mr-5" />,
    });

    fetchOrders();
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER PREMIUM */}
        <View className="relative">
          <Image
            source={{
              uri: resolveImageUrl(
                institutionData.pathBackgroundImage,
                PATH_INSTITUTION_COVER
              ),
            }}
            className="w-full h-[220]"
          />

          <LinearGradient
            colors={[
              'rgba(0,0,0,0.65)',
              'rgba(0,0,0,0.45)',
              'rgba(0,0,0,0.25)',
            ]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          <TouchableOpacity
            onPress={handleToggleFavorite}
            disabled={likeLoading}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.45)',
              padding: 10,
              borderRadius: 999,
              zIndex: 10,
              opacity: likeLoading ? 0.5 : 1,
            }}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={25}
              color={liked ? '#ff4d6d' : '#fff'}
            />
          </TouchableOpacity>

          <View className="absolute bottom-6 left-4 right-4">
            <Text className="text-2xl font-bold text-white">
              {institutionData.name}
            </Text>
            <Text className="text-sm text-white/80 mt-1">
              {formatCNPJ(institutionData.cnpj)}
            </Text>
          </View>

          {institutionData.pathLogoImage && (
            <View
              style={{
                position: 'absolute',
                right: 16,
                bottom: -24,
                backgroundColor: colors.background,
                padding: 14,
                borderRadius: 16,
                elevation: 6,
              }}
            >
              <Image
                source={{ uri: resolveImageUrl(institutionData.pathLogoImage) }}
                style={{ width: 80, height: 40, resizeMode: 'contain' }}
              />
            </View>
          )}
        </View>

        {/* MAP CARD */}
        <View className="mt-6 px-4">
          <View
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ width: '100%', height: 160 }}
              region={mapRegion}
              customMapStyle={theme === 'dark' ? MAP_DARK_STYLE : []}
            >
              <Marker coordinate={location} title={institutionData.name} />
            </MapView>
          </View>
        </View>

        {/* CAUSA SOCIAL */}
        <View className="mt-6 px-4">
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Principal causa social
          </Text>

          <View className="mt-4 rounded-2xl overflow-hidden">
            <Image
              source={{
                uri: resolveImageUrl(
                  institutionData.social_issue?.pathImage,
                  PATH_INSTITUTION_COVER
                ),
              }}
              style={{ height: 200 }}
            />

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 120,
              }}
            />

            <View className="absolute bottom-4 left-4 right-4">
              <Text className="text-lg font-semibold text-white">
                {institutionData.social_issue?.title}
              </Text>
              <Text className="text-sm mt-2" style={{ color: '#9e9e9e' }}>
                {institutionData.social_issue?.description}
              </Text>
            </View>
          </View>
        </View>

        {/* PEDIDOS */}
        <View className="mt-6">
          <View className="px-4 mb-4">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Pedidos de doação
            </Text>
            <Text className="text-sm mt-1" style={{ color: colors.text + 'CC' }}>
              Escolha como ajudar esta instituição
            </Text>
          </View>

          <FlatList
            horizontal
            data={ordersData}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              { paddingHorizontal: 16 },
              ordersData.length === 0 && { flex: 1 }
            ]}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center">
                <Text
                  className="text-center"
                  style={{ color: colors.text + 'CC' }}
                >
                  Nenhum pedido disponível
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <OrderCard
                item={item}
                onQuantityChange={handleQuantityChange}
                initialQuantity={getQuantityForOrder(item.id)}
              />
            )}
          />
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
