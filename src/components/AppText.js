import React from 'react';
import { Text } from 'react-native';
import { colors, fonts } from '../theme';

const WEIGHTS = {
  regular: fonts.regular,
  medium: fonts.medium,
  semibold: fonts.semibold,
  bold: fonts.bold,
};

export default function AppText({
  children,
  style,
  weight = 'regular',
  color = colors.ink,
  ...props
}) {
  return (
    <Text
      allowFontScaling={false}
      {...props}
      style={[
        {
          fontFamily: WEIGHTS[weight] || fonts.regular,
          color,
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
