import { Institution } from "./entities/Institution";
import { SocialIssue } from "./entities/SocialIssue";

export type RootStackParamList = {
  // Auth Screens
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;

  // Main Layout
  Layout: undefined;

  // Client Screens
  EditProfile: undefined;
  ClientCart: undefined;
  CartCheckout: undefined;

  // Institution Screens
  ReceiveDonationQuest: undefined;
  InstitutionSettings: undefined;
  EditInstitutionProfile: undefined;

  // Common Screens
  Privacy: undefined;
  PrivacyPolicy: undefined;
  About: undefined;
  Help: undefined;
  InstitutionProfile: { institution: Institution; hideActions?: boolean };
  ListInstitutions: { socialIssueId?: number } | undefined;
  ListSocialIssues: undefined;

  // Legacy (kept for compatibility)
  Overview: undefined;
  Details: { name: string };
};

export type ClientScreenType =
  'Home' | 'Donation' | 'Favorites' | 'Settings';

export type InstitutionScreenType =
  'Dashboard' | 'Stock' | 'Orders' | 'Reports';