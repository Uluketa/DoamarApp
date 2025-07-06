import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '~/store/modules/rootReducer';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '~/types/navigation';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '~/styles/colors';

// Definindo os tipos de botões disponíveis na NavBar
export interface NavButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  isActive: boolean;
}

const NavButton = ({ icon, onPress, isActive }: NavButtonProps) => (
  <TouchableOpacity className="flex-1 justify-center items-center" onPress={onPress}>
    {React.cloneElement(icon as React.ReactElement, { color: isActive ? colors.palette[1] : 'gray' })}
  </TouchableOpacity>
);

interface NavBarProps {
  activeScreen: string;
}

export const NavBar = ({ activeScreen }: NavBarProps) => {
  const { userType } = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  const getButtonsByUserType = () => {
    switch (userType) {
      case 'client':
        return [
          { title: 'ClientHome', icon: <MaterialIcons name="home" size={30} />, onPress: () => navigation.navigate('ClientHome') },
          { title: 'ClientFavorites', icon: <FontAwesome name="heart" size={24} />, onPress: () => navigation.navigate('ClientFavorites') },
          { title: 'ClientDonation', icon: <FontAwesome5 name="hand-holding-heart" size={24} />, onPress: () => navigation.navigate('ClientDonation') },
          { title: 'ClientSettings', icon: <MaterialIcons name="settings" size={30} />, onPress: () => navigation.navigate('ClientSettings') },
        ];
      case 'institution':
        return [
          { title: 'Dashboard', icon: <MaterialIcons name="dashboard" size={24} />, onPress: () => navigation.navigate('Dashboard') },
          { title: 'Stock', icon: <MaterialIcons name="inventory" size={24} />, onPress: () => navigation.navigate('Stock') },
          { title: 'Orders', icon: <FontAwesome5 name="shopping-bag" size={24} />, onPress: () => navigation.navigate('Orders') },
          { title: 'Reports', icon: <MaterialIcons name="bar-chart" size={24} />, onPress: () => navigation.navigate('Reports') },
        ];
      default:
        return [
          { title: 'Home', icon: <MaterialIcons name="home" size={24} />, onPress: () => navigation.navigate('Home') },
          { title: 'Login', icon: <MaterialIcons name="login" size={24} />, onPress: () => navigation.navigate('Login') },
        ];
    }
  };

  // Obtem os botões apropriados
  const buttons = getButtonsByUserType();

  return (
    <View className="
      h-20
      rounded-t-xl 
      flex-row 
      justify-around 
      bg-white 
      inset-x-0 
      bottom-0
      shadow-lg
      absolute
    ">
      {buttons.map((button, index) => (
        <NavButton
          key={index}
          title={button.title}
          icon={button.icon}
          onPress={button.onPress}
          isActive={activeScreen === button.title}
        />
      ))}
    </View>
  );
};