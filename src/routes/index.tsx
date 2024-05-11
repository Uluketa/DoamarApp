import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Details from '../screens/details';
import HomeClient from '../screens/HomeClient';
import HomeCompany from '../screens/HomeCompany';
import ForgotPassword from '../screens/ForgotPassword';
import ReceiveDonationQuest from '../screens/ReceiveDonationQuest';

import { colors } from '~/styles/colors';
import Logo from '~/components/Logo';

export type RootStackParamList = {
  Overview: undefined;
  Details: { name: string };
  SignIn: undefined;
  SignUp: undefined;
  HomeClient: undefined;
  HomeCompany: undefined;
  ForgotPassword: undefined;
  ReceiveDonationQuest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={
            {
              title: 'Cadastre-se',
              headerStyle: {
                backgroundColor: colors.palette[1]
              },
              headerTitleStyle: {
                color: '#f0f0f0'
              },
              headerRight: () => <Logo />,
              headerTintColor: '#f0f0f0'
            }
          }
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={
            {
              title: 'Esqueci a senha',
              headerStyle: {
                backgroundColor: colors.palette[1]
              },
              headerTitleStyle: {
                color: '#f0f0f0'
              },
              headerRight: () => <Logo />,
              headerTintColor: '#f0f0f0'
            }
          }
        />

        <Stack.Screen name="HomeClient" component={HomeClient} />
        <Stack.Screen name="HomeCompany" component={HomeCompany} />
        
        <Stack.Screen
          name="ReceiveDonationQuest"
          component={ReceiveDonationQuest}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Details"
          component={Details}
          options={({ navigation }) => ({
            headerLeft: () => <BackButton onPress={navigation.goBack} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}