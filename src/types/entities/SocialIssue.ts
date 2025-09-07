import { Ionicons } from "@expo/vector-icons";

export type SocialIssue = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  pathImage?: string;
  created_at: string;
  updated_at: string;
};