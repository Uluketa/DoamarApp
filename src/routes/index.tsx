import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';

import SignIn from '../screens/SignIn';
import HomeClient from '../screens/HomeClient';
import HomeCompany from '../screens/HomeCompany';
import ForgotPassword from '../screens/ForgotPassword';
import Details from '../screens/details';

export type RootStackParamList = {
  Overview: undefined;
  Details: { name: string };
  SignIn: undefined;
  HomeClient: undefined;
  HomeCompany: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="HomeClient" component={HomeClient} />
        <Stack.Screen name="HomeCompany" component={HomeCompany} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Esqueci a senha' }}/>
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