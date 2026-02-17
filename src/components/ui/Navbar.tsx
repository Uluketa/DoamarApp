import { View, TouchableOpacity, Platform } from 'react-native';
import { ClientScreenType } from '~/types/Navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '~/styles/colors';
import { cloneElement, isValidElement } from 'react';

import { InstitutionScreenType } from '~/types/Navigation';

type UserType = 'client' | 'institution';

interface NavBarProps {
  activeScreen: string;
  setActiveScreen: (screen: ClientScreenType | InstitutionScreenType) => void;
  userType: UserType;
}

export interface NavButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  isActive: boolean;
}

const NavButton = ({ icon, onPress, isActive }: NavButtonProps) => (
  <TouchableOpacity className="flex-1 justify-center items-center" onPress={onPress}>
    {isValidElement(icon)
      ? cloneElement(icon as React.ReactElement<any>, { color: isActive ? colors.text : colors.text + '80' })
      : icon}
  </TouchableOpacity>
);

export const NavBar = ({ activeScreen, setActiveScreen, userType }: NavBarProps) => {
  const insets = useSafeAreaInsets();
  
  const clientScreens = [
    {
      title: 'Home',
      icon: <MaterialIcons name="home" size={30} />,
      onPress: () => setActiveScreen('Home'),
    },
    {
      title: 'Favorites',
      icon: <FontAwesome name="heart" size={24} />,
      onPress: () => setActiveScreen('Favorites'),
    },
    {
      title: 'Donation',
      icon: <FontAwesome5 name="hand-holding-heart" size={24} />,
      onPress: () => setActiveScreen('Donation'),
    },
    {
      title: 'Settings',
      icon: <MaterialIcons name="settings" size={30} />,
      onPress: () => setActiveScreen('Settings'),
    },
  ];

  const institutionScreens = [
    {
      title: 'Dashboard',
      icon: <MaterialIcons name="dashboard" size={30} />,
      onPress: () => setActiveScreen('Dashboard'),
    },
    {
      title: 'Stock',
      icon: <MaterialIcons name="inventory" size={24} />,
      onPress: () => setActiveScreen('Stock'),
    },
    {
      title: 'Orders',
      icon: <FontAwesome5 name="shopping-bag" size={24} />,
      onPress: () => setActiveScreen('Orders'),
    },
    {
      title: 'Reports',
      icon: <MaterialIcons name="bar-chart" size={30} />,
      onPress: () => setActiveScreen('Reports'),
    },
  ];

  const screens = userType === 'institution' ? institutionScreens : clientScreens;

  return (
    <View 
      className='flex-row border-t' 
      style={{ 
        backgroundColor: colors.background, 
        borderTopColor: colors.text + '20', // Cor da barrinha superior (text com 12% opacidade)
        borderTopWidth: 1,
        paddingBottom: Platform.OS === 'android' ? 20 : 5,
        paddingTop: 20
      }}
    >
      {screens.map((button, index) => (
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