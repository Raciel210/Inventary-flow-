import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { DetailHeader } from '../components/Header';
import AppText from '../components/AppText';
import Badge from '../components/Badge';
import BottomSheet from '../components/BottomSheet';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import IconButton from '../components/IconButton';
import MovementRow from '../components/MovementRow';
import ProductIcon from '../components/ProductIcon';
import { useApp } from '../context/AppContext';
import { colors, radii } from '../theme';
import {
  deficit,
  formatMoney,
  formatNumber,
  getStockRatio,
  getStockStatus,
} from '../utils/format';

export default function ProductDetailScreen({ navigation, route }) {
  const { products, movements, deleteProduct } = useApp();
  const { productId } = route.params || {};
  const [menuOpen, setMenuOpen] = useState(false);

  const product = products.find((item) => item.id === productId);
  const productMovements = useMemo(
    () => movements.filter((movement) => movement.productId === productId),
    [movements, productId],
  );

  if (!product) {
    return (
      <Screen>
        <DetailHeader
          title="Detalle de producto"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="package"
          title="Producto no encontrado"
          description="Este producto ya no está disponible en el inventario."
          actionLabel="Volver al inventario"
          onAction={() => navigation.goBack()}
          style={styles.notFound}
        />
      </Screen>
    );
  }

  const status = getStockStatus(product);
  const ratio = getStockRatio(product);
  const statusText =
    status.key === 'low'
      ? `${formatNumber(deficit(product))} ${
          deficit(product) === 1 ? 'unidad' : 'unidades'
        } por debajo del mínimo`
      : status.key === 'out'
        ? 'Sin unidades disponibles'
        : 'Nivel por encima del mínimo';

  const statusColor =
    status.key === 'low' || status.key === 'out'
      ? colors.amberText
      : colors.greenText;
  const barColor =
    status.key === 'low'
      ? colors.amber
      : status.key === 'out'
        ? colors.ink
        : colors.green;

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar producto',
      `Se eliminará “${product.name}” y su historial de movimientos. Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteProduct(product.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const goToMovements = () => {
    navigation.getParent()?.navigate('MovimientosTab', { productId: product.id });
  };

  return (
    <Screen>
      <DetailHeader
        title="Detalle de producto"
        onBack={() => navigation.goBack()}
        right={
          <IconButton
            name="more-horizontal"
            size={24}
            onPress={() => setMenuOpen(true)}
            accessibilityLabel="Más opciones del producto"
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.identityCard}>
          <View style={styles.identityTop}>
            <ProductIcon
              product={product}
              size={64}
              height={64}
              iconSize={32}
              radius={radii.md}
            />
            <View style={styles.identityInfo}>
              <AppText weight="bold" style={styles.productName} numberOfLines={2}>
                {product.name}
              </AppText>
              <AppText style={styles.reference} numberOfLines={1}>
                SKU: {product.sku} · {product.category}
              </AppText>
              <Badge
                label={status.label}
                tone={status.tone}
                style={styles.identityBadge}
              />
            </View>
          </View>
          <AppText style={styles.description}>{product.description}</AppText>
        </View>

        <View style={styles.stockCard}>
          <View style={styles.stockTop}>
            <AppText weight="semibold" style={styles.stockLabel}>
              Stock disponible
            </AppText>
            <AppText weight="bold" style={styles.stockValue}>
              {formatNumber(product.stock)} uds.
            </AppText>
          </View>
          <View style={styles.stockBar}>
            <View
              style={[
                styles.stockFill,
                { width: `${Math.round(ratio * 100)}%`, backgroundColor: barColor },
              ]}
            />
          </View>
          <View style={styles.stockBottom}>
            <AppText style={[styles.stockWarning, { color: statusColor }]}>
              {statusText}
            </AppText>
            <AppText style={styles.stockMin}>
              Mín. {formatNumber(product.minStock)}
            </AppText>
          </View>
        </View>

        <View style={styles.dataRow}>
          <View style={styles.dataItem}>
            <AppText style={styles.dataLabel}>Ubicación</AppText>
            <AppText weight="semibold" style={styles.dataValue} numberOfLines={1}>
              {product.location || 'Sin ubicación'}
            </AppText>
          </View>
          <View style={styles.dataItem}>
            <AppText style={styles.dataLabel}>Precio unitario</AppText>
            <AppText weight="semibold" style={styles.dataValue} numberOfLines={1}>
              {formatMoney(product.price)}
            </AppText>
          </View>
        </View>

        <View style={styles.history}>
          <View style={styles.sectionHeader}>
            <AppText weight="bold" style={styles.sectionTitle}>
              Últimos movimientos
            </AppText>
            <Pressable
              accessibilityRole="button"
              onPress={goToMovements}
              hitSlop={8}
            >
              <AppText weight="semibold" style={styles.sectionLink}>
                Ver todo
              </AppText>
            </Pressable>
          </View>

          <View style={styles.historyCard}>
            {productMovements.length === 0 ? (
              <View style={styles.emptyHistory}>
                <AppText style={styles.emptyHistoryText}>
                  Este producto aún no tiene movimientos.
                </AppText>
              </View>
            ) : (
              productMovements.slice(0, 2).map((movement, index, shown) => (
                <MovementRow
                  key={movement.id}
                  movement={movement}
                  product={product}
                  mode="history"
                  showDivider={index < shown.length - 1}
                />
              ))
            )}
          </View>
        </View>

        <Button
          label="Registrar movimiento"
          icon="repeat"
          onPress={() =>
            navigation.navigate('Movement', { productId: product.id })
          }
          style={styles.primaryAction}
        />
      </ScrollView>

      <BottomSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Opciones del producto"
      >
        <View style={styles.menu}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMenuOpen(false);
              navigation.navigate('ProductForm', {
                mode: 'edit',
                productId: product.id,
              });
            }}
            style={({ pressed }) => [styles.menuRow, pressed && styles.menuPressed]}
          >
            <Feather name="edit-2" size={18} color={colors.ink} />
            <AppText weight="medium" style={styles.menuText}>
              Editar producto
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMenuOpen(false);
              confirmDelete();
            }}
            style={({ pressed }) => [
              styles.menuRow,
              styles.menuRowBorder,
              pressed && styles.menuPressed,
            ]}
          >
            <Feather name="trash-2" size={18} color={colors.amberText} />
            <AppText weight="medium" style={[styles.menuText, { color: colors.amberText }]}>
              Eliminar producto
            </AppText>
          </Pressable>
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  identityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 20,
  },
  identityTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  identityInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 18,
    lineHeight: 22,
  },
  reference: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 6,
  },
  identityBadge: {
    marginTop: 7,
  },
  description: {
    fontSize: 12,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 16,
  },
  stockCard: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
  },
  stockTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
  },
  stockLabel: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.inkSoft,
  },
  stockValue: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -1,
  },
  stockBar: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginTop: 12,
  },
  stockFill: {
    height: 6,
    borderRadius: radii.pill,
  },
  stockBottom: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockWarning: {
    flex: 1,
    fontSize: 11,
    lineHeight: 13,
    paddingRight: 10,
  },
  stockMin: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.muted,
  },
  dataRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  dataItem: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
  },
  dataValue: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.inkSoft,
    marginTop: 7,
  },
  history: {
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  historyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  emptyHistory: {
    padding: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  primaryAction: {
    marginTop: 22,
  },
  notFound: {
    flex: 1,
  },
  menu: {
    paddingTop: 4,
  },
  menuRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuPressed: {
    opacity: 0.6,
  },
  menuText: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
    marginLeft: 12,
  },
});
