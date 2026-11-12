import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from './AppText';
import { colors, fonts, radii } from '../theme';

export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconSize = 20,
  iconColor,
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const resolvedIconColor =
    iconColor || (isPrimary ? colors.surface : colors.ink);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        !isPrimary && !isSecondary && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.ink} />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Feather
              name={icon}
              size={iconSize}
              color={resolvedIconColor}
              style={styles.icon}
            />
          ) : null}
          <AppText
            weight="semibold"
            style={[
              styles.label,
              { color: isPrimary ? colors.surface : colors.ink },
              textStyle,
            ]}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: fonts.semibold,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.82,
  },
});
