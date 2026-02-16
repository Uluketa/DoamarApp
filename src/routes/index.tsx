import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '~/types/Navigation';
import React from 'react';

// Auth Screens
import { SignIn } from '~/components/screens/SignIn';
import { SignUp } from '~/components/screens/SignUp';
import { ForgotPassword } from '~/components/screens/ForgotPassword';

// Client Screens
import { ClientCart } from '~/components/screens/Client/Cart';
import { CartCheckout } from '~/components/screens/Client/CartCheckout';
import EditProfile from '~/components/screens/Client/EditProfile';

// Institution Screens
import { ReceiveDonationQuest } from '~/components/screens/Institution/ReceiveDonationQuest';
import InstitutionSettings from '~/components/screens/Institution/Settings';
import EditInstitutionProfile from '~/components/screens/Institution/EditProfile';

// Common Screens
import { About } from '~/components/screens/About';
import { InstitutionProfile } from '~/components/screens/InstitutionProfile';
import { Layout } from '~/components/ui/Layout';
import { PrivacyPolicy } from '~/components/screens/PrivacyPolicy';
import ListInstitutions from '~/components/screens/ListInstitutions';
import ListSocialIssuesScreen from '~/components/screens/ListSocialIssues';

import { useSelector } from 'react-redux';
import { RootState } from '../store';

import { colors } from '~/styles/colors';
import { Logo } from '~/components/Logo';
import { CartHeader } from '~/components/CartHeader';

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
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: '#f0f0f0',
              fontSize: 12,
            },
            headerTitleContainerStyle: {
              alignItems: 'center',
            },
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerStatusBarHeight: 0,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerBackTitle: 'Voltar',
            headerBackTitleVisible: true
          }}
        >
          {!userData.id ? (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
              />
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
              options={{
                headerShown: false,
                gestureEnabled: false,
                title: "Voltar"
              }}
            />
          )}

          {/* Common Screens */}
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{
              gestureEnabled: false,
              title: "Política de Privacidade",
              headerRight: () => <Logo />
            }}
          />

          <Stack.Screen
            name="About"
            component={About}
            options={{
              gestureEnabled: false,
              title: "Sobre",
              headerRight: () => <Logo />
            }}
          />

          {/* Client Screens */}
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              title: "Editar Perfil",
              headerRight: () => <Logo />
            }}
          />

          <Stack.Screen
            name="InstitutionSettings"
            component={InstitutionSettings}
            options={{
              title: "Configurações",
              headerRight: () => <Logo />
            }}
          />

          <Stack.Screen
            name="EditInstitutionProfile"
            component={EditInstitutionProfile}
            options={{
              title: "Editar Instituição",
              headerRight: () => <Logo />
            }}
          />

          <Stack.Screen
            name="ClientCart"
            component={ClientCart}
            options={{
              gestureEnabled: false,
              title: "Carrinho",
              headerRight: () => <Logo />
            }}
          />

          <Stack.Screen
            name="CartCheckout"
            component={CartCheckout}
            options={{
              title: "Confirmar Doações",
              headerRight: () => <Logo />,
              gestureEnabled: false
            }}
          />

          {/* Institution Screens */}
          <Stack.Screen
            name="ListSocialIssues"
            component={ListSocialIssuesScreen}
            options={{
              gestureEnabled: false,
              title: "Causas Sociais",
              headerRight: () => <Logo />,
              headerStatusBarHeight: 0
            }}
          />

          <Stack.Screen
            name="ListInstitutions"
            component={ListInstitutions}
            options={{
              gestureEnabled: false,
              title: "Instituições",
              headerRight: () => <Logo />,
              headerStatusBarHeight: 0
            }}
          />

          <Stack.Screen
            name="InstitutionProfile"
            component={InstitutionProfile}
            options={{
              gestureEnabled: false,
              headerRight: () => <CartHeader classlist='mr-5' />
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
