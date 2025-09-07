import { Institution } from "./entities/Institution";

export type RootStackParamList = {
  Overview: undefined;
  Details: { name: string };
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ReceiveDonationQuest: undefined;

  Privacy: undefined;
  Help: undefined;
  About: undefined;
  InstitutionProfile: { institution: Institution }

  Layout: undefined;
};

export type ClientScreenType =
  'Home' | 'Donation' | 'Favorites' | 'Settings';

export type InstitutionScreenType =
  'Dashboard' | 'Stock' | 'Orders' | 'Reports';