import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from './AppText';
import Badge from './Badge';
import ProductIcon from './ProductIcon';
import { colors, radii } from '../theme';
import { formatNumber, getStockStatus } from '../utils/format';

export default function ProductRow({ product, onPress, style }) {
  const status = getStockStatus(product);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.stock} unidades`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <ProductIcon
        product={product}
        size={44}
        height={52}
        iconSize={24}
        radius={radii.sm}
      />
      <View style={styles.info}>
        <AppText weight="semibold" style={styles.name} numberOfLines={1}>
          {product.name}
        </AppText>
        <AppText style={styles.reference} numberOfLines={1}>
          {product.sku} · {product.category}
        </AppText>
        <View style={styles.bottomRow}>
          <Badge label={status.label} tone={status.tone} />
          <AppText weight="semibold" style={styles.units}>
            {formatNumber(product.stock)} uds.
          </AppText>
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={colors.placeholder} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 85,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  name: {
    fontSize: 13,
    lineHeight: 16,
  },
  reference: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 6,
  },
  bottomRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  units: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.inkSoft,
  },
});
