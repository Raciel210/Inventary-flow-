import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radii } from '../theme';

export default function ProductIcon({
  product,
  icon,
  size = 44,
  height = size,
  iconSize = 24,
  radius = radii.sm,
  style,
  background = colors.background,
}) {
  const photo = product?.photo;
  const resolvedIcon = icon || product?.icon || 'package-variant';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height,
          borderRadius: radius,
          backgroundColor: background,
        },
        style,
      ]}
    >
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', height: '100%', borderRadius: radius }}
          resizeMode="cover"
        />
      ) : (
        <MaterialCommunityIcons name={resolvedIcon} size={iconSize} color={colors.ink} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
