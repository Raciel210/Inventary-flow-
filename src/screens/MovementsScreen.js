import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { MainHeader } from '../components/Header';
import AppText from '../components/AppText';
import EmptyState from '../components/EmptyState';
import IconButton from '../components/IconButton';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';
import { colors, radii } from '../theme';
import { formatMovementDate, formatNumber } from '../utils/format';

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function MovementCard({ movement, product, onPress }) {
  const isEntrada = movement.type === 'entrada';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.movementCard, pressed && styles.pressed]}
    >
      <View style={styles.movementIcon}>
        <Feather
          name={isEntrada ? 'arrow-down-left' : 'arrow-up-right'}
          size={20}
          color={colors.ink}
        />
      </View>
      <View style={styles.movementInfo}>
        <AppText weight="semibold" style={styles.movementName} numberOfLines={1}>
          {product?.name || 'Producto'}
        </AppText>
        <AppText style={styles.movementMeta} numberOfLines={1}>
          {isEntrada ? 'Entrada' : 'Salida'} · {movement.reason}
        </AppText>
        <AppText style={styles.movementDate} numberOfLines={1}>
          {formatMovementDate(movement.date)} · {movement.responsible}
        </AppText>
      </View>
      <AppText weight="semibold" style={styles.movementQuantity}>
        {isEntrada ? '+' : '−'}
        {formatNumber(movement.quantity)}
      </AppText>
    </Pressable>
  );
}

export default function MovementsScreen({ navigation, route }) {
  const { products, movements } = useApp();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [productFilterId, setProductFilterId] = useState(
    route.params?.productId || null,
  );

  useEffect(() => {
    if (route.params?.productId) {
      setProductFilterId(route.params.productId);
    }
  }, [route.params?.productId]);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const productFilter = productFilterId
    ? products.find((product) => product.id === productFilterId)
    : null;

  const filteredMovements = useMemo(() => {
    const search = normalize(query.trim());
    return movements.filter((movement) => {
      if (typeFilter !== 'all' && movement.type !== typeFilter) return false;
      if (productFilterId && movement.productId !== productFilterId) return false;
      if (!search) return true;
      const product = productMap.get(movement.productId);
      return (
        normalize(product?.name).includes(search) ||
        normalize(product?.sku).includes(search) ||
        normalize(movement.reason).includes(search) ||
        normalize(movement.note).includes(search)
      );
    });
  }, [movements, query, typeFilter, productFilterId, productMap]);

  const hasFilters = Boolean(query.trim()) || typeFilter !== 'all' || Boolean(productFilterId);

  const clearProductFilter = () => {
    setProductFilterId(null);
    navigation.setParams({ productId: undefined });
  };

  const clearFilters = () => {
    setQuery('');
    setTypeFilter('all');
    clearProductFilter();
  };

  return (
    <Screen>
      <MainHeader
        title="Movimientos"
        subtitle="Historial de entradas y salidas"
        right={
          <IconButton
            name="plus-circle"
            size={24}
            onPress={() => navigation.navigate('Movement')}
            accessibilityLabel="Registrar movimiento"
          />
        }
      />

      <View style={styles.filtersHeader}>
        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar producto o motivo"
          icon="search"
          autoCapitalize="none"
          rightElement={
            query ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpiar búsqueda"
                onPress={() => setQuery('')}
                hitSlop={8}
              >
                <Feather name="x" size={16} color={colors.placeholder} />
              </Pressable>
            ) : null
          }
        />

        {productFilter ? (
          <View style={styles.productFilter}>
            <View style={styles.productFilterIcon}>
              <Feather name="package" size={16} color={colors.ink} />
            </View>
            <View style={styles.productFilterInfo}>
              <AppText style={styles.productFilterLabel}>Filtrando por producto</AppText>
              <AppText weight="semibold" style={styles.productFilterName} numberOfLines={1}>
                {productFilter.name}
              </AppText>
            </View>
            <IconButton
              name="x"
              size={18}
              color={colors.muted}
              onPress={clearProductFilter}
              accessibilityLabel="Quitar filtro de producto"
            />
          </View>
        ) : null}

        <View style={styles.chips}>
          {[
            { label: 'Todos', value: 'all' },
            { label: 'Entradas', value: 'entrada' },
            { label: 'Salidas', value: 'salida' },
          ].map((option) => {
            const active = typeFilter === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => setTypeFilter(option.value)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  weight={active ? 'semibold' : 'regular'}
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.resultsRow}>
          <AppText style={styles.resultsText}>
            {formatNumber(filteredMovements.length)}{' '}
            {filteredMovements.length === 1 ? 'movimiento' : 'movimientos'}
          </AppText>
          {hasFilters ? (
            <Pressable
              accessibilityRole="button"
              onPress={clearFilters}
              hitSlop={6}
            >
              <AppText weight="semibold" style={styles.clearText}>
                Limpiar filtros
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovementCard
            movement={item}
            product={productMap.get(item.productId)}
            onPress={() =>
              navigation.navigate('InventarioTab', {
                screen: 'ProductDetail',
                params: { productId: item.productId },
                initial: false,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContent,
          filteredMovements.length === 0 && styles.listEmptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon="repeat"
            title={hasFilters ? 'No hay movimientos con estos filtros' : 'Aún no hay movimientos'}
            description={
              hasFilters
                ? 'Prueba con otro término o limpia los filtros.'
                : 'Registra la primera entrada o salida de tu inventario.'
            }
            actionLabel={hasFilters ? 'Limpiar filtros' : 'Registrar movimiento'}
            onAction={
              hasFilters ? clearFilters : () => navigation.navigate('Movement')
            }
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filtersHeader: {
    paddingHorizontal: 24,
  },
  productFilter: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productFilterIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  productFilterInfo: {
    flex: 1,
    marginRight: 8,
  },
  productFilterLabel: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.muted,
  },
  productFilterName: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.inkSoft,
  },
  chipTextActive: {
    color: colors.surface,
  },
  pressed: {
    opacity: 0.65,
  },
  resultsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
  },
  clearText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  listEmptyContent: {
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },
  movementCard: {
    minHeight: 82,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  movementIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  movementInfo: {
    flex: 1,
    paddingRight: 10,
  },
  movementName: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.ink,
  },
  movementMeta: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.inkSoft,
    marginTop: 4,
  },
  movementDate: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 3,
  },
  movementQuantity: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.ink,
    minWidth: 32,
    textAlign: 'right',
  },
});
