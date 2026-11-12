import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import IconButton from './IconButton';
import { colors, layout } from '../theme';

export function MainHeader({ title, subtitle, right, style }) {
  return (
    <View style={[styles.mainHeader, style]}>
      <View style={styles.titleWrap}>
        <AppText weight="bold" style={styles.mainTitle} numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

export function DetailHeader({ title, onBack, right, style }) {
  return (
    <View style={[styles.detailHeader, style]}>
      <View style={styles.backButton}>
        {onBack ? (
          <IconButton
            name="arrow-left"
            size={24}
            onPress={onBack}
            accessibilityLabel="Regresar"
          />
        ) : null}
      </View>
      <AppText
        weight="bold"
        style={styles.detailTitle}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </AppText>
      <View style={styles.detailRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.headerPaddingTop,
    paddingBottom: layout.headerPaddingBottom,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  mainTitle: {
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 5,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 14,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.6,
  },
  detailRight: {
    width: 24,
    height: 24,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
