import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/navigation';

import { Logo } from '~/components/Logo';
import { colors } from '~/styles/colors';
import { getDonationsByInstitution, listInstitution, URL } from '~/services/api';
import { InstitutionType } from '~/types/institution';

import MapView, { Marker } from "react-native-maps";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCNPJ } from '~/core/helpers';
import { DonationType } from '~/types/donation';
import { DonationCard } from './components/DonationCard';

// Tipagem das props da tela
type Props = StackScreenProps<RootStackParamList, 'CompanyProfile'>;

export function CompanyProfile({ route, navigation }: Props) {
  const [companyData, setCompanyData] = useState<InstitutionType | null>(null);
  const [donationData, setDonationData] = useState<Array<DonationType>>([]);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const { companyId, companyName } = route.params;

  const fetchCompany = async () => {
    const response = await listInstitution(companyId);
    setCompanyData(response.data)

    const donations = await getDonationsByInstitution(companyId);
    if (donations.data) {
      setDonationData(donations.data);
    }

    getCoordinates(response.data.addressCep, response.data.addressNumber);
  };

  const getCoordinates = async (cep: string, number: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${cep},${number},Brasil`,
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

  useEffect(() => {
    if (companyData === null) {
      fetchCompany();
    }
  }, [companyId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: companyName,
      headerRight: () => <Logo />,
    });

    fetchCompany();
  }, [navigation, companyName]);

  return (
    <View className='flex-1'>
      <Image
        className="w-full h-[150] absolute"
        source={{ uri: `http://${URL}${companyData?.background}` }}
      />

      <View className='mt-[150] z-40'>
        <View
          className='flex flex-row items-center justify-between w-full px-4 py-2'
        >
          <View>
            <Text style={styles.title}>{companyName}</Text>
            <Text className='text-md text-gray-400'>{formatCNPJ(companyData?.cnpj ?? '')}</Text>
          </View>

          <Image
            source={{ uri: `http://${URL}${companyData?.logo}` }}
            className='shadow-2xl'
            style={{
              width: 100,
              height: 50,
              resizeMode: 'contain'
            }}
          />
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
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={location} title={companyName} />
            </MapView>
          </View>
        ) : (
          <View
            className='flex flex-col justify-center items-center'
            style={{ width: "100%", height: 150, backgroundColor: colors.palette[1] }}
          >
            <Ionicons name="map" size={25} color="white" />
            <Text className='text-xl font-bold text-white mt-4'>{companyData?.address} - {companyData?.addressNumber}</Text>

          </View>
        )}

        <View className='pl-4 py-6'>
          <Text className='text-2xl font-bold mb-2'>Pedidos de doação</Text>
          <FlatList
            horizontal
            data={donationData}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <DonationCard item={item} />
            )}
          />
        </View>

        <View className='pl-4 py-6'>
          <Text className='text-2xl font-bold mb-2'>Questões Sociais</Text>
          <FlatList
            horizontal
            data={donationData}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <></>
            )}
          />
        </View>
      </View>

      <View
        className='absolute h-[100] w-[95%] bottom-[1.5%] left-[2.5%] rounded-lg p-5 z-50'
        style={{ backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: colors.palette[3] }}>
        <Text className='text-2xl font-bold mb-2'>Resumo</Text>
        <View className='w-[100%] justify-between items-center flex flex-row'>
          <Text className='text-lg font-bold mb-2' style={{color: colors.palette[3]}}>3 Pac. Macarrão</Text>
          <TouchableOpacity
            className='p-3 rounded-md w-24 items-center'
            style={{ backgroundColor: colors.palette[3] }}
          ><Text className='text-white'>Finalizar</Text></TouchableOpacity>
        </View>
      </View>
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
