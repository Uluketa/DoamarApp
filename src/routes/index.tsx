import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/navigation';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons"
import React from 'react';

import { SignIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';
import { ForgotPassword } from '../screens/ForgotPassword';
import { ReceiveDonationQuest } from '../screens/Company/ReceiveDonationQuest';

// Client Screens
import ClientHome from '../screens/Client/Home';
import ClientDonation from '../screens/Client/Donation';
import ClientSettings from '../screens/Client/Settings';
import ClientFavorites from '../screens/Client/Favorites';

// Company Screens
import CompanyHome from '../screens/Company/Home';

import About from '../screens/About';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

import { colors } from '~/styles/colors';
import { Logo } from '~/components/Logo';
import toastConfig from '~/styles/toast';

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  const { userType, userId } = useSelector((state: RootState) => state.user);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={userType ? (userType === 'client' ? 'ClientHome' : 'CompanyHome') : 'SignIn'}
          screenOptions={{
            animationEnabled: false,
            headerTintColor: '#f0f0f0',
            headerTitleStyle: {
              color: '#f0f0f0',
            },
            headerStyle: {
              backgroundColor: colors.palette[1],
            },
          }}
        >
          {!userId ? (
            <>
              <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                  title: 'Cadastre-se',
                  headerRight: () => <Logo />,
                }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                  title: 'Esqueci a senha',
                  headerRight: () => <Logo />
                }}
              />
            </>
          ) : (userType == 'client') ? (
            <>
              <Stack.Screen name="ClientHome" component={ClientHome} options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="ClientDonation" component={ClientDonation} options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="ClientSettings" component={ClientSettings} options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="ClientFavorites" component={ClientFavorites} options={{ headerShown: false, gestureEnabled: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="CompanyHome" component={CompanyHome} options={{ gestureEnabled: false }} />
              <Stack.Screen
                name="ReceiveDonationQuest"
                component={ReceiveDonationQuest}
                options={{ headerShown: false, gestureEnabled: true }}
              />
            </>
          )}

          <Stack.Screen
            name="About"
            component={About}
            options={{ gestureEnabled: false, title: "Sobre", headerRight: () => <Logo /> }}
          />

        </Stack.Navigator>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </>
  );
}
