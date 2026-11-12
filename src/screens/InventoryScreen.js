import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { MainHeader } from '../components/Header';
import AppText from '../components/AppText';
import BottomSheet from '../components/BottomSheet';
import EmptyState from '../components/EmptyState';
import IconButton from '../components/IconButton';
import ProductRow from '../components/ProductRow';
import ScannerModal from '../components/ScannerModal';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';
import { SORT_OPTIONS } from '../data/seed';
import { colors, radii } from '../theme';
import { formatNumber } from '../utils/format';

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function InventoryScreen({ navigation }) {
  const { products, categories, lowStockProducts } = useApp();
  const [query, setQuery] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('recent');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label || 'Más recientes';

  const filteredProducts = useMemo(() => {
    const search = normalize(query.trim());
    let result = products.filter((product) => {
      if (lowOnly && product.stock > product.minStock) return false;
      if (category !== 'all' && product.category !== category) return false;
      if (!search) return true;
      return (
        normalize(product.name).includes(search) ||
        normalize(product.sku).includes(search) ||
        normalize(product.category).includes(search)
      );
    });

    result = [...result];
    switch (sort) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      case 'stock-asc':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-desc':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, query, lowOnly, category, sort]);

  const hasFilters = Boolean(query.trim()) || lowOnly || category !== 'all';

  const clearFilters = () => {
    setQuery('');
    setLowOnly(false);
    setCategory('all');
  };

  const handleScanned = (code) => {
    setScannerOpen(false);
    const exact = products.find(
      (product) => normalize(product.sku) === normalize(code),
    );
    if (exact) {
      clearFilters();
      navigation.navigate('ProductDetail', { productId: exact.id });
      return;
    }
    setQuery(code);
  };

  return (
    <Screen>
      <MainHeader
        title="Inventario"
        subtitle={`${formatNumber(products.length)} productos en tu almacén`}
        right={
          <IconButton
            name="plus-circle"
            size={24}
            onPress={() => navigation.navigate('ProductForm', { mode: 'add' })}
            accessibilityLabel="Añadir producto"
          />
        }
      />

      <View style={styles.catalogHeader}>
        <TextField
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar nombre o SKU"
          icon="search"
          autoCapitalize="none"
          returnKeyType="search"
          rightElement={
            <View style={styles.searchActions}>
              {query ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpiar búsqueda"
                  onPress={() => setQuery('')}
                  hitSlop={8}
                  style={styles.clearButton}
                >
                  <Feather name="x" size={16} color={colors.placeholder} />
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Escanear código de barras"
                onPress={() => setScannerOpen(true)}
                hitSlop={8}
              >
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={20}
                  color={colors.ink}
                />
              </Pressable>
            </View>
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filters}
        >
          <Pressable
            accessibilityRole="button"
            onPress={clearFilters}
            style={({ pressed }) => [
              styles.chip,
              !lowOnly && category === 'all' && styles.chipActive,
              pressed && styles.pressed,
            ]}
          >
            <AppText
              weight={!lowOnly && category === 'all' ? 'semibold' : 'medium'}
              style={[
                styles.chipText,
                !lowOnly && category === 'all' && styles.chipTextActive,
              ]}
            >
              Todos
            </AppText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setLowOnly((prev) => !prev)}
            style={({ pressed }) => [
              styles.chip,
              styles.chipBordered,
              lowOnly && styles.chipActive,
              pressed && styles.pressed,
            ]}
          >
            <AppText
              weight={lowOnly ? 'semibold' : 'regular'}
              style={[styles.chipText, lowOnly && styles.chipTextActive]}
            >
              Bajo stock ({lowStockProducts.length})
            </AppText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => setCategoryOpen(true)}
            style={({ pressed }) => [
              styles.chip,
              styles.chipBordered,
              styles.categoryChip,
              category !== 'all' && styles.chipActive,
              pressed && styles.pressed,
            ]}
          >
            <AppText
              weight={category !== 'all' ? 'semibold' : 'regular'}
              style={[
                styles.chipText,
                category !== 'all' && styles.chipTextActive,
                styles.categoryText,
              ]}
              numberOfLines={1}
            >
              {category === 'all' ? 'Categoría' : category}
            </AppText>
            <Feather
              name="chevron-down"
              size={14}
              color={category !== 'all' ? colors.surface : colors.ink}
              style={styles.chevron}
            />
          </Pressable>
        </ScrollView>

        <View style={styles.resultsRow}>
          <AppText style={styles.resultsText}>
            Mostrando {formatNumber(filteredProducts.length)} de{' '}
            {formatNumber(products.length)}
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSortOpen(true)}
            style={({ pressed }) => [styles.sortButton, pressed && styles.pressed]}
            hitSlop={6}
          >
            <AppText style={styles.sortText}>{sortLabel}</AppText>
            <MaterialCommunityIcons name="sort" size={14} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetail', { productId: item.id })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContent,
          filteredProducts.length === 0 && styles.listEmptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon={hasFilters ? 'search' : 'package'}
            title={
              hasFilters
                ? 'No se encontraron productos'
                : 'Aún no hay productos registrados'
            }
            description={
              hasFilters
                ? 'Prueba con otro nombre, SKU o cambia los filtros.'
                : 'Añade tu primer producto para comenzar a controlar el inventario.'
            }
            actionLabel={hasFilters ? 'Limpiar filtros' : 'Añadir producto'}
            onAction={
              hasFilters
                ? clearFilters
                : () => navigation.navigate('ProductForm', { mode: 'add' })
            }
          />
        }
      />

      <BottomSheet
        visible={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        title="Filtrar por categoría"
      >
        <View style={styles.sheetList}>
          {[{ name: 'Todas las categorías', value: 'all' }, ...categories.map((name) => ({ name, value: name }))].map(
            (option, index, list) => {
              const selected = category === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  onPress={() => {
                    setCategory(option.value);
                    setCategoryOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.sheetRow,
                    index < list.length - 1 && styles.sheetRowBorder,
                    pressed && styles.sheetRowPressed,
                  ]}
                >
                  <AppText
                    weight={selected ? 'semibold' : 'regular'}
                    style={styles.sheetRowText}
                  >
                    {option.name}
                  </AppText>
                  {selected ? (
                    <Feather name="check" size={18} color={colors.ink} />
                  ) : null}
                </Pressable>
              );
            },
          )}
        </View>
      </BottomSheet>

      <BottomSheet
        visible={sortOpen}
        onClose={() => setSortOpen(false)}
        title="Ordenar productos"
      >
        <View style={styles.sheetList}>
          {SORT_OPTIONS.map((option, index) => {
            const selected = sort === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => {
                  setSort(option.value);
                  setSortOpen(false);
                }}
                style={({ pressed }) => [
                  styles.sheetRow,
                  index < SORT_OPTIONS.length - 1 && styles.sheetRowBorder,
                  pressed && styles.sheetRowPressed,
                ]}
              >
                <AppText
                  weight={selected ? 'semibold' : 'regular'}
                  style={styles.sheetRowText}
                >
                  {option.label}
                </AppText>
                {selected ? (
                  <Feather name="check" size={18} color={colors.ink} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>

      <ScannerModal
        visible={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanned={handleScanned}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  catalogHeader: {
    paddingHorizontal: 24,
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filtersScroll: {
    marginTop: 16,
    marginHorizontal: -24,
  },
  filters: {
    paddingHorizontal: 24,
    gap: 8,
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
    flexDirection: 'row',
  },
  chipBordered: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  categoryChip: {
    maxWidth: 170,
    paddingHorizontal: 12,
  },
  categoryText: {
    flexShrink: 1,
  },
  chevron: {
    marginLeft: 6,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
    marginRight: 5,
  },
  pressed: {
    opacity: 0.65,
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
  sheetList: {
    paddingTop: 4,
  },
  sheetRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetRowPressed: {
    opacity: 0.6,
  },
  sheetRowText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
    paddingRight: 10,
  },
});
