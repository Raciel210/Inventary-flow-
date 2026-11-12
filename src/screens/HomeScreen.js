import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { MainHeader } from '../components/Header';
import AppText from '../components/AppText';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import MovementRow from '../components/MovementRow';
import { useApp } from '../context/AppContext';
import { colors, radii } from '../theme';
import { formatNumber, formatShortDate } from '../utils/format';

function SummaryCard({ label, value, description, icon, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.summaryCard, pressed && styles.pressed]}
    >
      <View style={styles.summaryTop}>
        <AppText style={styles.summaryLabel}>{label}</AppText>
        <Feather name={icon} size={18} color={colors.muted} />
      </View>
      <AppText weight="bold" style={styles.summaryValue}>
        {value}
      </AppText>
      <AppText style={styles.summaryDescription}>{description}</AppText>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const {
    products,
    movements,
    totalUnits,
    categories,
    lowStockProducts,
    settings,
  } = useApp();

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const recentMovements = movements.slice(0, 3);
  const priorityProduct = lowStockProducts[0];
  const lowCount = lowStockProducts.length;

  const goToInventory = () => {
    navigation.navigate('InventarioTab', { screen: 'InventoryList' });
  };

  const goToProduct = (productId) => {
    navigation.navigate('InventarioTab', {
      screen: 'ProductDetail',
      params: { productId },
      initial: false,
    });
  };

  return (
    <Screen>
      <MainHeader
        title="Inicio"
        subtitle={`Almacén central · ${formatShortDate(new Date())}`}
        right={
          <View style={styles.bellWrap}>
            <IconButton
              name="bell"
              size={24}
              onPress={() => navigation.navigate('Alerts')}
              accessibilityLabel="Ver alertas de inventario"
            />
            {settings.notifications && lowCount > 0 ? (
              <View style={styles.bellDot} />
            ) : null}
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.summaryRow}>
          <SummaryCard
            label="Productos"
            value={formatNumber(products.length)}
            description={`En ${formatNumber(categories.length)} categorías`}
            icon="package"
            onPress={goToInventory}
          />
          <SummaryCard
            label="Unidades"
            value={formatNumber(totalUnits)}
            description="Disponibles en almacén"
            icon="layers"
            onPress={goToInventory}
          />
        </View>

        {settings.notifications && lowCount > 0 && priorityProduct ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Alerts')}
            style={({ pressed }) => [styles.alertCard, pressed && styles.pressed]}
          >
            <View style={styles.alertTop}>
              <Feather name="alert-triangle" size={22} color={colors.amberText} />
              <View style={styles.alertMessage}>
                <AppText weight="semibold" style={styles.alertTitle}>
                  {lowCount === 1
                    ? '1 producto con bajo stock'
                    : `${lowCount} productos con bajo stock`}
                </AppText>
                <AppText style={styles.alertDescription}>
                  Revisa los niveles para evitar faltantes.
                </AppText>
              </View>
            </View>
            <View style={styles.alertBottom}>
              <View style={styles.alertProduct}>
                <AppText weight="semibold" style={styles.alertProductName} numberOfLines={1}>
                  {priorityProduct.name}
                </AppText>
                <AppText style={styles.alertProductStock}>
                  {formatNumber(priorityProduct.stock)}{' '}
                  {priorityProduct.stock === 1 ? 'unidad' : 'unidades'} · mínimo{' '}
                  {formatNumber(priorityProduct.minStock)}
                </AppText>
              </View>
              <View style={styles.alertLink}>
                <AppText weight="semibold" style={styles.alertLinkText}>
                  Ver todos
                </AppText>
                <Feather name="arrow-right" size={16} color={colors.ink} />
              </View>
            </View>
          </Pressable>
        ) : null}

        {settings.notifications && lowCount === 0 ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Feather name="check-circle" size={20} color={colors.greenText} />
            </View>
            <View style={styles.successInfo}>
              <AppText weight="semibold" style={styles.successTitle}>
                Todo el inventario está en orden
              </AppText>
              <AppText style={styles.successText}>
                No hay productos por debajo del mínimo.
              </AppText>
            </View>
          </View>
        ) : null}

        <Button
          label="Registrar movimiento"
          icon="repeat"
          onPress={() => navigation.navigate('Movement')}
          style={styles.primaryAction}
        />

        <View style={styles.activity}>
          <View style={styles.sectionHeader}>
            <AppText weight="bold" style={styles.sectionTitle}>
              Últimos movimientos
            </AppText>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('MovimientosTab')}
              hitSlop={8}
            >
              <AppText weight="semibold" style={styles.sectionLink}>
                Ver todos
              </AppText>
            </Pressable>
          </View>

          <View style={styles.movementsCard}>
            {recentMovements.length === 0 ? (
              <View style={styles.emptyMovements}>
                <AppText style={styles.emptyText}>
                  Aún no hay movimientos registrados.
                </AppText>
              </View>
            ) : (
              recentMovements.map((movement, index) => (
                <MovementRow
                  key={movement.id}
                  movement={movement}
                  product={productMap.get(movement.productId)}
                  showDivider={index < recentMovements.length - 1}
                  onPress={() => {
                    if (movement.productId) goToProduct(movement.productId);
                  }}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  bellWrap: {
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: colors.amber,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minHeight: 116,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 18,
  },
  summaryLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -1,
    marginTop: 10,
  },
  summaryDescription: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.muted,
    marginTop: 6,
  },
  alertCard: {
    backgroundColor: colors.amberBg,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    borderRadius: radii.md,
    padding: 16,
    marginTop: 22,
  },
  alertTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertMessage: {
    flex: 1,
    marginLeft: 10,
  },
  alertTitle: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.inkSoft,
  },
  alertDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.amberText,
    marginTop: 4,
  },
  alertBottom: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertProduct: {
    flex: 1,
    paddingRight: 10,
  },
  alertProductName: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.inkSoft,
  },
  alertProductStock: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 4,
  },
  alertLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertLinkText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
    marginRight: 4,
  },
  successCard: {
    marginTop: 22,
    backgroundColor: colors.greenBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  successInfo: {
    flex: 1,
  },
  successTitle: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.ink,
  },
  successText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 3,
  },
  primaryAction: {
    marginTop: 20,
  },
  activity: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 19,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 19,
  },
  sectionLink: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
  },
  movementsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  emptyMovements: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
