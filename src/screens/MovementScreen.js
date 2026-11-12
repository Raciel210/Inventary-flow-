import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { DetailHeader } from '../components/Header';
import AppText from '../components/AppText';
import BottomSheet from '../components/BottomSheet';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import ProductIcon from '../components/ProductIcon';
import SelectField from '../components/SelectField';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';
import { MOVEMENT_REASONS } from '../data/seed';
import { colors, fonts, radii } from '../theme';
import { formatNumber } from '../utils/format';

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function MovementScreen({ navigation, route }) {
  const { products, registerMovement } = useApp();
  const initialProductId = route.params?.productId || null;
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [type, setType] = useState('entrada');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState(MOVEMENT_REASONS.entrada[0]);
  const [note, setNote] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const reasonOptions = useMemo(
    () =>
      MOVEMENT_REASONS[type].map((value) => ({
        label: value,
        value,
      })),
    [type],
  );

  const filteredProducts = useMemo(() => {
    const search = normalize(pickerQuery.trim());
    if (!search) return products;
    return products.filter(
      (product) =>
        normalize(product.name).includes(search) ||
        normalize(product.sku).includes(search),
    );
  }, [products, pickerQuery]);

  const currentStock = selectedProduct?.stock || 0;
  const resultingStock =
    type === 'entrada' ? currentStock + quantity : currentStock - quantity;
  const invalidExit = type === 'salida' && quantity > currentStock;
  const canSave =
    Boolean(selectedProduct) &&
    Number.isInteger(quantity) &&
    quantity > 0 &&
    !invalidExit &&
    Boolean(reason) &&
    !saving;

  const previewStatus = useMemo(() => {
    if (!selectedProduct) {
      return {
        tone: 'muted',
        icon: 'info',
        text: 'Selecciona un producto para ver el stock final.',
      };
    }
    if (invalidExit) {
      return {
        tone: 'low',
        icon: 'alert-triangle',
        text: `No hay unidades suficientes. Disponibles: ${formatNumber(currentStock)}.`,
      };
    }
    if (resultingStock <= 0) {
      return {
        tone: 'low',
        icon: 'alert-triangle',
        text: 'Sin stock · El producto quedará agotado.',
      };
    }
    if (resultingStock <= selectedProduct.minStock) {
      return {
        tone: 'low',
        icon: 'alert-triangle',
        text: `Bajo stock · Por debajo del mínimo de ${formatNumber(
          selectedProduct.minStock,
        )}`,
      };
    }
    return {
      tone: 'ok',
      icon: 'check-circle',
      text: `En stock · Por encima del mínimo de ${formatNumber(
        selectedProduct.minStock,
      )}`,
    };
  }, [selectedProduct, invalidExit, resultingStock, currentStock]);

  const changeType = (nextType) => {
    if (nextType === type) return;
    setType(nextType);
    setReason(MOVEMENT_REASONS[nextType][0]);
    if (nextType === 'salida' && selectedProduct) {
      setQuantity((prev) => Math.max(1, Math.min(prev, selectedProduct.stock)));
    }
  };

  const changeQuantity = (next) => {
    const parsed = Number.parseInt(String(next).replace(/\D/g, ''), 10);
    if (Number.isNaN(parsed)) {
      setQuantity(0);
      return;
    }
    setQuantity(Math.min(parsed, 99999));
  };

  const increment = () => {
    setQuantity((prev) => {
      if (type === 'salida' && selectedProduct) {
        return Math.min(selectedProduct.stock, prev + 1);
      }
      return Math.min(99999, prev + 1);
    });
  };

  const decrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const save = () => {
    if (!selectedProduct) {
      Alert.alert('Selecciona un producto', 'Elige el producto que deseas mover.');
      return;
    }
    if (!quantity || quantity <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad mayor a cero.');
      return;
    }
    if (invalidExit) {
      Alert.alert(
        'Stock insuficiente',
        `Solo hay ${currentStock} unidades disponibles de ${selectedProduct.name}.`,
      );
      return;
    }

    setSaving(true);
    const result = registerMovement({
      productId: selectedProduct.id,
      type,
      quantity,
      reason,
      note,
    });
    setSaving(false);

    if (!result.ok) {
      Alert.alert('No se pudo guardar', result.error);
      return;
    }

    Alert.alert(
      'Movimiento registrado',
      `${type === 'entrada' ? 'Entrada' : 'Salida'} de ${quantity} ${
        quantity === 1 ? 'unidad' : 'unidades'
      } de ${selectedProduct.name}. Stock actual: ${formatNumber(
        result.newStock,
      )}.`,
      [{ text: 'Listo', onPress: () => navigation.goBack() }],
    );
  };

  const closePicker = () => {
    setPickerOpen(false);
    setPickerQuery('');
  };

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <DetailHeader
        title="Registrar movimiento"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => setPickerOpen(true)}
            style={({ pressed }) => [
              styles.selectedCard,
              pressed && styles.pressed,
            ]}
          >
            {selectedProduct ? (
              <>
                <ProductIcon
                  product={selectedProduct}
                  size={44}
                  height={44}
                  iconSize={24}
                  radius={radii.sm}
                />
                <View style={styles.selectedInfo}>
                  <AppText weight="semibold" style={styles.selectedName} numberOfLines={1}>
                    {selectedProduct.name}
                  </AppText>
                  <AppText style={styles.selectedMeta} numberOfLines={1}>
                    {selectedProduct.sku} · Stock actual:{' '}
                    {formatNumber(selectedProduct.stock)} uds.
                  </AppText>
                </View>
              </>
            ) : (
              <>
                <View style={styles.selectIcon}>
                  <Feather name="search" size={20} color={colors.muted} />
                </View>
                <View style={styles.selectedInfo}>
                  <AppText weight="semibold" style={styles.selectedName}>
                    Selecciona un producto
                  </AppText>
                  <AppText style={styles.selectedMeta}>
                    Toca para buscar en el inventario
                  </AppText>
                </View>
              </>
            )}
            <Feather name="chevron-down" size={20} color={colors.muted} />
          </Pressable>

          <View style={styles.field}>
            <AppText weight="semibold" style={styles.label}>
              Tipo de movimiento
            </AppText>
            <View style={styles.segment}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: type === 'entrada' }}
                onPress={() => changeType('entrada')}
                style={({ pressed }) => [
                  styles.segmentItem,
                  type === 'entrada' && styles.segmentItemActive,
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  name="arrow-down-left"
                  size={18}
                  color={type === 'entrada' ? colors.surface : colors.muted}
                />
                <AppText
                  weight={type === 'entrada' ? 'semibold' : 'regular'}
                  style={[
                    styles.segmentText,
                    type === 'entrada' && styles.segmentTextActive,
                  ]}
                >
                  Entrada
                </AppText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: type === 'salida' }}
                onPress={() => changeType('salida')}
                style={({ pressed }) => [
                  styles.segmentItem,
                  type === 'salida' && styles.segmentItemActive,
                  pressed && styles.pressed,
                ]}
              >
                <Feather
                  name="arrow-up-right"
                  size={18}
                  color={type === 'salida' ? colors.surface : colors.muted}
                />
                <AppText
                  weight={type === 'salida' ? 'semibold' : 'regular'}
                  style={[
                    styles.segmentText,
                    type === 'salida' && styles.segmentTextActive,
                  ]}
                >
                  Salida
                </AppText>
              </Pressable>
            </View>
          </View>

          <View style={styles.field}>
            <AppText weight="semibold" style={styles.label}>
              Cantidad de unidades
            </AppText>
            <View style={styles.counter}>
              <IconButton
                name="minus"
                size={20}
                color={colors.ink}
                onPress={decrement}
                disabled={quantity <= 1}
                accessibilityLabel="Restar una unidad"
              />
              <TextInput
                value={String(quantity)}
                onChangeText={changeQuantity}
                keyboardType="number-pad"
                maxLength={5}
                selectTextOnFocus
                style={styles.counterValue}
                selectionColor={colors.ink}
                allowFontScaling={false}
              />
              <IconButton
                name="plus"
                size={20}
                color={colors.ink}
                onPress={increment}
                disabled={type === 'salida' && quantity >= currentStock}
                accessibilityLabel="Sumar una unidad"
              />
            </View>
            {type === 'salida' && selectedProduct ? (
              <AppText style={styles.maxHint}>
                Máximo disponible: {formatNumber(selectedProduct.stock)} uds.
              </AppText>
            ) : null}
          </View>

          <View style={styles.field}>
            <SelectField
              label="Motivo"
              value={reason}
              onChange={setReason}
              options={reasonOptions}
              sheetTitle="Motivo del movimiento"
            />
          </View>

          <View style={styles.field}>
            <TextField
              label="Nota (opcional)"
              value={note}
              onChangeText={setNote}
              placeholder="Ej. Pedido OC-2026-048"
              multiline
              height={76}
              maxLength={140}
            />
          </View>

          <View style={styles.preview}>
            <View style={styles.previewTop}>
              <AppText style={styles.previewLabel}>
                Stock después del movimiento
              </AppText>
              <AppText weight="bold" style={styles.previewValue}>
                {selectedProduct
                  ? `${formatNumber(Math.max(0, resultingStock))} uds.`
                  : '—'}
              </AppText>
            </View>
            <View style={styles.previewStatus}>
              <Feather
                name={previewStatus.icon}
                size={16}
                color={
                  previewStatus.tone === 'ok'
                    ? colors.greenText
                    : previewStatus.tone === 'low'
                      ? colors.amberText
                      : colors.muted
                }
              />
              <AppText
                style={[
                  styles.previewStatusText,
                  {
                    color:
                      previewStatus.tone === 'ok'
                        ? colors.greenText
                        : previewStatus.tone === 'low'
                          ? colors.amberText
                          : colors.muted,
                  },
                ]}
              >
                {previewStatus.text}
              </AppText>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Guardar movimiento"
            icon="check"
            onPress={save}
            loading={saving}
            disabled={!canSave}
          />
          <AppText style={styles.responsible}>
            Se registrará a nombre de Ana García
          </AppText>
        </View>
      </KeyboardAvoidingView>

      <BottomSheet
        visible={pickerOpen}
        onClose={closePicker}
        title="Seleccionar producto"
        subtitle="Busca por nombre o SKU"
      >
        <TextField
          value={pickerQuery}
          onChangeText={setPickerQuery}
          placeholder="Buscar producto"
          icon="search"
          autoCapitalize="none"
          style={styles.pickerSearch}
        />
        {filteredProducts.length === 0 ? (
          <View style={styles.pickerEmpty}>
            <AppText style={styles.pickerEmptyText}>
              No se encontraron productos.
            </AppText>
          </View>
        ) : (
          filteredProducts.map((product, index) => {
            const selected = product.id === selectedProductId;
            return (
              <Pressable
                key={product.id}
                accessibilityRole="button"
                onPress={() => {
                  setSelectedProductId(product.id);
                  setQuantity(1);
                  closePicker();
                }}
                style={({ pressed }) => [
                  styles.pickerRow,
                  index < filteredProducts.length - 1 && styles.pickerRowBorder,
                  pressed && styles.pickerRowPressed,
                ]}
              >
                <ProductIcon
                  product={product}
                  size={38}
                  height={38}
                  iconSize={20}
                />
                <View style={styles.pickerInfo}>
                  <AppText weight="semibold" style={styles.pickerName} numberOfLines={1}>
                    {product.name}
                  </AppText>
                  <AppText style={styles.pickerMeta} numberOfLines={1}>
                    {product.sku} · {formatNumber(product.stock)} uds.
                  </AppText>
                </View>
                {selected ? (
                  <Feather name="check" size={18} color={colors.ink} />
                ) : null}
              </Pressable>
            );
          })
        )}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  selectedCard: {
    minHeight: 72,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  selectIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  selectedName: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.ink,
  },
  selectedMeta: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 5,
  },
  field: {
    marginTop: 20,
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.inkSoft,
    marginBottom: 8,
  },
  segment: {
    height: 46,
    backgroundColor: colors.border,
    borderRadius: radii.sm,
    padding: 4,
    flexDirection: 'row',
  },
  segmentItem: {
    flex: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.ink,
  },
  segmentText: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.muted,
    marginLeft: 8,
  },
  segmentTextActive: {
    color: colors.surface,
  },
  counter: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterValue: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    lineHeight: 24,
    color: colors.ink,
    textAlign: 'center',
    minWidth: 60,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  maxHint: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 6,
  },
  preview: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 16,
  },
  previewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  previewLabel: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
    paddingRight: 10,
  },
  previewValue: {
    fontSize: 18,
    lineHeight: 22,
  },
  previewStatus: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewStatusText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  responsible: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  pickerSearch: {
    marginTop: 4,
    marginBottom: 6,
  },
  pickerRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerRowPressed: {
    opacity: 0.6,
  },
  pickerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  pickerName: {
    fontSize: 13,
    lineHeight: 16,
  },
  pickerMeta: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 4,
  },
  pickerEmpty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  pickerEmptyText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
