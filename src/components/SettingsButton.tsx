import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '~/styles/colors';

interface SettingsButtonProps {
  title: string;
  onPress: () => void;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  bbtm?: boolean;
  color?: string;
}

export default function SettingsButton({
  title,
  onPress,
  iconName,
  bbtm = true,
  color = colors.text,
}: SettingsButtonProps) {
  return (
    <TouchableOpacity
      className="py-5 flex-row items-center"
      onPress={onPress}
      style={
        bbtm
          ? {
              borderBottomWidth: 1,
              borderColor: colors.border,
            }
          : undefined
      }
    >
      <View style={{ marginRight: 12 }}>
        <Ionicons name={iconName} size={22} color={color} />
      </View>

      <Text className="text-lg" style={{ color }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
