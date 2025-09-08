import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/Navigation';

import { Logo } from '~/components/Logo';
import { colors } from '~/styles/colors';
import { getOrdersByInstitution, URL } from '~/api';
import { Institution } from '~/types/entities/Institution';

import MapView, { Marker } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCNPJ, PATH_INSTITUTION_COVER, PATH_INSTITUTION_PHOTO } from '~/core/helpers';
import { Order } from '~/types/entities/Order';
import { OrderCard } from './components/OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';
import { Cart } from '~/components/Cart';
import { setCartItems } from '~/store/modules/cart/actions';

// Tipagem das props da tela
type Props = StackScreenProps<RootStackParamList, 'InstitutionProfile'>;

export function InstitutionProfile({ route, navigation }: Props) {
  const [institutionData, setInstitutionData] = useState<Institution>(route.params['institution']);
  const [ordersData, setOrdersData] = useState<Array<Order>>([]);

  const { items } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.user);
  const [location, setLocation] = useState({
    latitude: -23.55052, // São Paulo
    longitude: -46.633308,
  });

  const dispatch = useDispatch();

  const handleQuantityChange = (order: Order, qty: number) => {
    dispatch(setCartItems({
      items: (items ?? []).filter(item => item.id !== order.id).concat(
        qty > 0 ? [{ ...order, quantity: qty }] : []
      )
    }));
  };

  const fetchInstituionOrders = async () => {
    const orders = await getOrdersByInstitution(institutionData.id, token);
    if (orders.data) {
      setOrdersData(orders.data);
    }
  };

  const getCoordinates = async (cep: string, number: string) => {
    try {
      console.log(cep, number)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&country=Brasil&postalcode=${cep}&street=${number}`,
        {
          headers: { "User-Agent": "MyApp/1.0 (limirruda2@gmail.com)" },
        }
      );
      const data = await response.json();

      if (data.length > 0) {
        setLocation({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        });
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: institutionData.name,
      headerRight: () => <Cart classlist='mr-5' />,
    });

    fetchInstituionOrders();
    // getCoordinates(institutionData.addressCep, institutionData.addressNumber.toString());

  }, [navigation, institutionData.name]);

  return (
    <View className='flex-1'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <Image
          className="w-full h-[150] absolute"
          source={{ uri: `http://${URL}${institutionData?.pathBackgroundImage ? institutionData.pathBackgroundImage : PATH_INSTITUTION_COVER}` }}
        />

        <View className='mt-[150] z-40'>
          <View
            className='flex flex-row items-center justify-between w-full px-4 py-2'
          >
            <View>
              <Text style={styles.title}>{institutionData.name}</Text>
              <Text className='text-md text-gray-400'>{formatCNPJ(institutionData?.cnpj ?? '')}</Text>
            </View>

            {institutionData?.pathLogoImage && (
              <Image
                source={{ uri: `http://${URL}${institutionData.pathLogoImage}` }}
                className='shadow-2xl'
                style={{
                  width: 100,
                  height: 50,
                  resizeMode: 'contain'
                }}
              />
            )}
          </View>

          {location ? (
            <View className='relative'>
              {/* Gradiente */}
              <LinearGradient
                colors={['#f0f0f0', 'transparent']}
                className='z-50'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 100,
                }}
              />

              <MapView
                style={{ width: "100%", height: 150 }}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={location} title={institutionData.name} />
              </MapView>
            </View>
          ) : (
            <View
              className='flex flex-col justify-center items-center'
              style={{ width: "100%", height: 150, backgroundColor: colors.palette[1] }}
            >
              <Ionicons name="map" size={25} color="white" />
              <Text className='text-xl font-bold text-white mt-4'>{institutionData?.addressLine} - {institutionData?.addressNumber}</Text>
            </View>
          )}

          <View className='py-6'>
            <Text className='text-2xl font-bold mb-2 pl-4'>Principal Causa Social</Text>

            <View className="rounded-xl overflow-hidden relative">
              <Image
                source={{
                  uri: `http://${URL}${institutionData.social_issue?.pathImage ?
                    institutionData.social_issue?.pathImage :
                    PATH_INSTITUTION_COVER}`
                }}
                style={{ height: 200 }}
                className='w-[90%] mx-[5%] rounded-lg'
              />

              {/* Gradiente */}
              <LinearGradient
                colors={["transparent", colors.black]}
                className='w-[90%] mx-[5%] absolute bottom-[0] h-[100]'
              />

              {/* Texto Centralizado */}
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  right: 0,
                  height: 100,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text className="text-center text-lg text-white">{institutionData.social_issue?.title}</Text>
              </View>
            </View>
            <View className='bg-black w-[90%] mx-[5%] rounded-b-lg p-4'>
              <Text className="text-center text-sm text-white">{institutionData.social_issue?.description}</Text>
            </View>
          </View>

          <View className='pl-4 py-6'>
            <Text className='text-2xl font-bold mb-2'>Pedidos de doação</Text>
            <FlatList
              horizontal
              data={ordersData}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <OrderCard item={item} onQuantityChange={handleQuantityChange} />
              )}
            />
          </View>
        </View>
      </ScrollView>

      {items.length > 0 && (
        <View className='absolute bg-blue-600 px-5 py-4 rounded-lg items-center flex-row gap-2 bottom-4 right-4'>
          <Ionicons name="cart" size={18} color='white' />
          <Text className='text-white text-xl'>Ver Carrinho</Text>
        </View>

        // <View
        //   className='w-[100%] rounded-t-lg p-7 border-t border-gray-200'
        //   style={{ backgroundColor: colors.white }}
        // >
        //   <Text className='text-2xl font-bold mb-2'>Carrinho</Text>
        //   <View className='w-[100%] justify-between flex flex-col'>
        //     <View className='my-3'>
        //       {cart.slice(0, 3).map(item => (
        //           <Text className="text-gray-700 text-base">
        //             {item.quantity} × {item.order.name}
        //           </Text>
        //       ))}
        //     </View>

        //     <View className='flex-row w-full justify-end'>
        //       <TouchableOpacity
        //         className='px-5 py-3 rounded-md items-center flex-row gap-2'
        //         style={{ backgroundColor: colors.palette[3] }}
        //       >
        //         <Ionicons name="cart" size={18} color='white' />
        //         <Text className='text-white'>Finalizar</Text>
        //       </TouchableOpacity>
        //     </View>
        //   </View>
        // </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.palette[0],
  },
  description: {
    fontSize: 16,
    color: colors.palette[3],
    marginTop: 10,
  },
});
