import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/Navigation';
import Toast from 'react-native-toast-message';
import React from 'react';

import { SignIn } from '~/components/screens/SignIn';
import { SignUp } from '~/components/screens/SignUp';
import { ForgotPassword } from '~/components/screens/ForgotPassword';
import { ReceiveDonationQuest } from '~/components/screens/Institution/ReceiveDonationQuest';

import { About } from '~/components/screens/About';
import { InstitutionProfile } from '~/components/screens/InstitutionProfile';
import { Layout } from '~/components/ui/Layout';
import { ClientCart } from '~/components/screens/Client/Cart';

import { useSelector } from 'react-redux';
import { RootState } from '../store';

import { colors } from '~/styles/colors';
import { Logo } from '~/components/Logo';
import { CartHeader } from '~/components/CartHeader';

import toastConfig from '~/styles/toast';
import { PrivacyPolicy } from '~/components/screens/PrivacyPolicy';
import ListInstitutions from '~/components/screens/ListInstitutions';

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  const { userData } = useSelector((state: RootState) => state.user);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={userData.id ? "Layout" : 'SignIn'}
          screenOptions={{
            animationEnabled: true,
            headerTintColor: '#f0f0f0',
            headerTitleStyle: {
              color: '#f0f0f0',
            },
            headerStyle: {
              backgroundColor: colors.palette[1],
            },
            headerStatusBarHeight: 0,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        >
          {!userData.id ? (
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
          ) : (
            <Stack.Screen
              name="Layout"
              component={Layout}
              options={{ headerShown: false, gestureEnabled: false, title: "Voltar" }}
            />
          )}

          <Stack.Screen
            name="Privacy"
            component={PrivacyPolicy}
            options={{ gestureEnabled: false, title: "Política de Privacidade", headerRight: () => <Logo /> }}
          />

          <Stack.Screen
            name="About"
            component={About}
            options={{ gestureEnabled: false, title: "Sobre", headerRight: () => <Logo /> }}
          />

          <Stack.Screen
            name="ClientCart"
            component={ClientCart}
            options={{ gestureEnabled: false, title: "Carrinho", headerRight: () => <Logo /> }}
          />

          <Stack.Screen
            name="ListInstitutions"
            component={ListInstitutions}
            options={{ gestureEnabled: false, title: "Instituições", headerRight: () => <Logo />, headerStatusBarHeight: 0 }}
          />

          <Stack.Screen
            name="InstitutionProfile"
            component={InstitutionProfile}
            options={{ gestureEnabled: false, headerRight: () => <CartHeader classlist='mr-5' /> }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </>
  );
}
