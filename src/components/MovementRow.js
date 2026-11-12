import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from './AppText';
import { colors, radii } from '../theme';
import { formatMovementDate } from '../utils/format';

export default function MovementRow({
  movement,
  product,
  mode = 'product',
  onPress,
  showDivider = false,
  style,
}) {
  if (!movement) return null;

  const isEntrada = movement.type === 'entrada';
  const isHistory = mode === 'history';
  const typeLabel = isEntrada ? 'Entrada' : 'Salida';
  const title =
    mode === 'history'
      ? `${typeLabel} · ${movement.reason}`
      : product?.name || 'Producto';
  const subtitle =
    mode === 'history'
      ? `${formatMovementDate(movement.date)} · ${movement.responsible || 'Ana García'}`
      : `${typeLabel} · ${formatMovementDate(movement.date)}`;

  const content = (
    <>
      {isHistory ? (
        <View style={styles.historyIcon}>
          <Feather
            name={isEntrada ? 'arrow-down-left' : 'arrow-up-right'}
            size={20}
            color={colors.ink}
          />
        </View>
      ) : (
        <View style={styles.iconBox}>
          <Feather
            name={isEntrada ? 'arrow-down-left' : 'arrow-up-right'}
            size={19}
            color={colors.ink}
          />
        </View>
      )}
      <View style={styles.info}>
        <AppText weight="semibold" style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
        <AppText
          style={[styles.subtitle, isHistory && styles.historySubtitle]}
          numberOfLines={1}
        >
          {subtitle}
        </AppText>
      </View>
      <AppText weight="semibold" style={styles.quantity}>
        {isEntrada ? '+' : '−'}
        {movement.quantity}
      </AppText>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          isHistory && styles.historyRow,
          showDivider && styles.divider,
          pressed && styles.pressed,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.row,
        isHistory && styles.historyRow,
        showDivider && styles.divider,
        style,
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  historyRow: {
    minHeight: 60,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.inkSoft,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 5,
  },
  historySubtitle: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 3,
  },
  quantity: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.ink,
    minWidth: 32,
    textAlign: 'right',
  },
});
