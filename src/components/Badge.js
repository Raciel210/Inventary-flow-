import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, radii } from '../theme';

export default function Badge({ label, tone = 'ok', style, textStyle }) {
  const tones = {
    low: {
      backgroundColor: colors.amberBg,
      color: colors.amberText,
      dot: colors.amber,
    },
    ok: {
      backgroundColor: colors.greenBg,
      color: colors.greenText,
      dot: colors.green,
    },
    out: {
      backgroundColor: colors.ink,
      color: colors.surface,
      dot: colors.surface,
    },
    neutral: {
      backgroundColor: colors.background,
      color: colors.muted,
      dot: colors.placeholder,
    },
  };
  const palette = tones[tone] || tones.neutral;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.backgroundColor },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <AppText
        weight="semibold"
        style={[styles.text, { color: palette.color }, textStyle]}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 100,
    marginRight: 5,
  },
  text: {
    fontSize: 10,
    lineHeight: 12,
  },
});
