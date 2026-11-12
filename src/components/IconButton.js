import React from 'react';
import { Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function IconButton({
  name,
  family = 'Feather',
  size = 24,
  color = colors.ink,
  onPress,
  style,
  disabled = false,
  accessibilityLabel,
  hitSlop = 10,
  background,
}) {
  const Icon = family === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || name}
      disabled={disabled}
      onPress={onPress}
      hitSlop={hitSlop}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.35 : pressed ? 0.55 : 1,
          backgroundColor: background || 'transparent',
          borderRadius: background ? 100 : 0,
        },
        style,
      ]}
    >
      <Icon name={name} size={size} color={color} />
    </Pressable>
  );
}
