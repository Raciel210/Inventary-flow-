import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { DetailHeader } from '../components/Header';
import AppText from '../components/AppText';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import ProductIcon from '../components/ProductIcon';
import { useApp } from '../context/AppContext';
import { colors, radii } from '../theme';
import { deficit, formatNumber } from '../utils/format';

export default function AlertsScreen({ navigation }) {
  const { lowStockProducts } = useApp();

  const openProduct = (productId) => {
    navigation.navigate('Main', {
      screen: 'InventarioTab',
      params: {
        screen: 'ProductDetail',
        params: { productId },
        initial: false,
      },
      initial: false,
    });
  };

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <DetailHeader title="Alertas de stock" onBack={() => navigation.goBack()} />

      <FlatList
        data={lowStockProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.summary}>
              <View style={styles.summaryIcon}>
                <Feather name="alert-triangle" size={22} color={colors.amberText} />
              </View>
              <View style={styles.summaryInfo}>
                <AppText weight="semibold" style={styles.summaryTitle}>
                  {lowStockProducts.length === 0
                    ? 'Todo el inventario está en orden'
                    : lowStockProducts.length === 1
                      ? '1 producto requiere reposición'
                      : `${lowStockProducts.length} productos requieren reposición`}
                </AppText>
                <AppText style={styles.summaryText}>
                  {lowStockProducts.length === 0
                    ? 'Ningún producto está por debajo de su mínimo.'
                    : 'Revisa los niveles para evitar faltantes en tu almacén.'}
                </AppText>
              </View>
            </View>
            {lowStockProducts.length > 0 ? (
              <AppText weight="semibold" style={styles.sectionTitle}>
                Productos con bajo stock
              </AppText>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => openProduct(item.id)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <ProductIcon
              product={item}
              size={44}
              height={52}
              iconSize={24}
              radius={radii.sm}
            />
            <View style={styles.info}>
              <AppText weight="semibold" style={styles.name} numberOfLines={1}>
                {item.name}
              </AppText>
              <AppText style={styles.reference} numberOfLines={1}>
                {item.sku} · {item.category}
              </AppText>
              <View style={styles.bottomRow}>
                <Badge label="Bajo stock" tone="low" />
                <AppText weight="semibold" style={styles.stock}>
                  {formatNumber(item.stock)} uds. · mín. {formatNumber(item.minStock)}
                </AppText>
              </View>
            </View>
            <View style={styles.deficit}>
              <AppText weight="semibold" style={styles.deficitValue}>
                −{formatNumber(deficit(item))}
              </AppText>
              <AppText style={styles.deficitLabel}>faltan</AppText>
            </View>
            <Feather name="chevron-right" size={16} color={colors.placeholder} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="check-circle"
            title="Sin alertas de stock"
            description="Todos tus productos están por encima del mínimo configurado."
            actionLabel="Volver al inicio"
            onAction={() => navigation.navigate('Main')}
            style={styles.empty}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 4,
  },
  summary: {
    backgroundColor: colors.amberBg,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    borderRadius: radii.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.inkSoft,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.amberText,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.ink,
    marginTop: 22,
    marginBottom: 12,
  },
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
    marginTop: 5,
  },
  bottomRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stock: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.amberText,
  },
  deficit: {
    alignItems: 'center',
    marginRight: 8,
  },
  deficitValue: {
    fontSize: 13,
    lineHeight: 15,
    color: colors.amberText,
  },
  deficitLabel: {
    fontSize: 9,
    lineHeight: 11,
    color: colors.muted,
    marginTop: 2,
  },
  separator: {
    height: 10,
  },
  empty: {
    marginTop: 12,
  },
});
