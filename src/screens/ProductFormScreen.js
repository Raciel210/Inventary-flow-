import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Screen from '../components/Screen';
import { DetailHeader } from '../components/Header';
import AppText from '../components/AppText';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ProductIcon from '../components/ProductIcon';
import SelectField from '../components/SelectField';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';
import { CATEGORIES, iconForProduct } from '../data/seed';
import { colors, radii } from '../theme';
import { formatMoney, formatNumber } from '../utils/format';

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  label: category.name,
  value: category.name,
}));

export default function ProductFormScreen({ navigation, route }) {
  const { products, addProduct, updateProduct } = useApp();
  const mode = route.params?.mode === 'edit' ? 'edit' : 'add';
  const productId = route.params?.productId;
  const existing = products.find((product) => product.id === productId);
  const isEdit = mode === 'edit';

  const [name, setName] = useState(existing?.name || '');
  const [sku, setSku] = useState(existing?.sku || '');
  const [category, setCategory] = useState(existing?.category || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [stock, setStock] = useState(existing ? String(existing.stock) : '1');
  const [minStock, setMinStock] = useState(
    existing ? String(existing.minStock) : '5',
  );
  const [location, setLocation] = useState(existing?.location || '');
  const [photo, setPhoto] = useState(existing?.photo || null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const previewIcon = useMemo(
    () => iconForProduct(name, category),
    [name, category],
  );

  if (isEdit && !existing) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']}>
        <DetailHeader
          title="Editar producto"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="package"
          title="Producto no encontrado"
          description="No pudimos cargar la información de este producto."
          actionLabel="Volver"
          onAction={() => navigation.goBack()}
          style={styles.notFound}
        />
      </Screen>
    );
  }

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso requerido',
        'Permite el acceso a tus fotos para añadir una imagen al producto. Puedes guardarlo sin foto.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
  };

  const validate = () => {
    const next = {};
    const parsedPrice = Number.parseFloat(String(price).replace(',', '.'));
    const parsedStock = Number.parseInt(String(stock), 10);
    const parsedMin = Number.parseInt(String(minStock), 10);
    const cleanSku = sku.trim().toUpperCase();

    if (!name.trim()) next.name = 'Ingresa el nombre del producto.';
    if (!cleanSku) {
      next.sku = 'Ingresa un SKU.';
    } else if (
      products.some(
        (product) =>
          product.id !== existing?.id &&
          product.sku.trim().toUpperCase() === cleanSku,
      )
    ) {
      next.sku = 'Ya existe un producto con este SKU.';
    }
    if (!category) next.category = 'Selecciona una categoría.';
    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      next.price = 'Ingresa un precio mayor a cero.';
    }
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      next.stock = 'Ingresa una cantidad válida.';
    }
    if (Number.isNaN(parsedMin) || parsedMin < 0) {
      next.minStock = 'Ingresa un mínimo válido.';
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      Alert.alert('Revisa el formulario', 'Corrige los campos marcados para continuar.');
      return null;
    }

    const categoryData = CATEGORIES.find((item) => item.name === category);
    return {
      name: name.trim(),
      sku: cleanSku,
      category,
      categoryId: categoryData?.code || 'GEN',
      description: description.trim(),
      price: parsedPrice,
      stock: parsedStock,
      minStock: parsedMin,
      location: location.trim(),
      photo,
      icon: previewIcon,
    };
  };

  const save = async () => {
    const data = validate();
    if (!data) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (isEdit) {
      updateProduct(existing.id, data);
    } else {
      addProduct(data);
    }

    setSaving(false);
    Alert.alert(
      isEdit ? 'Producto actualizado' : 'Producto añadido',
      isEdit
        ? `${data.name} se actualizó correctamente.`
        : `${data.name} se añadió al inventario.`,
      [{ text: 'Listo', onPress: () => navigation.goBack() }],
    );
  };

  const statusText = (() => {
    const parsedStock = Number.parseInt(String(stock), 10);
    const parsedMin = Number.parseInt(String(minStock), 10);
    if (Number.isNaN(parsedStock) || Number.isNaN(parsedMin)) {
      return {
        tone: 'muted',
        icon: 'info',
        text: 'Completa stock y mínimo para ver el estado.',
      };
    }
    if (parsedStock <= 0) {
      return {
        tone: 'low',
        icon: 'alert-triangle',
        text: 'Sin stock · El producto se guardará agotado.',
      };
    }
    if (parsedStock <= parsedMin) {
      return {
        tone: 'low',
        icon: 'alert-triangle',
        text: `Bajo stock · Por debajo del mínimo de ${formatNumber(parsedMin)}`,
      };
    }
    return {
      tone: 'ok',
      icon: 'check-circle',
      text: `En stock · Por encima del mínimo de ${formatNumber(parsedMin)}`,
    };
  })();

  const priceValue = Number.parseFloat(String(price).replace(',', '.'));

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <DetailHeader
        title={isEdit ? 'Editar producto' : 'Añadir producto'}
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
            onPress={pickPhoto}
            style={({ pressed }) => [styles.photoCard, pressed && styles.pressed]}
          >
            <ProductIcon
              product={{ photo }}
              icon={previewIcon}
              size={64}
              height={64}
              iconSize={30}
              radius={radii.md}
            />
            <View style={styles.photoInfo}>
              <AppText weight="semibold" style={styles.photoTitle}>
                {photo ? 'Cambiar foto' : 'Añadir foto'}
              </AppText>
              <AppText style={styles.photoText}>
                {photo
                  ? 'Toca para seleccionar otra imagen'
                  : 'Opcional · JPG o PNG'}
              </AppText>
            </View>
            <Feather name="image" size={20} color={colors.muted} />
          </Pressable>

          {photo ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setPhoto(null)}
              style={styles.removePhoto}
            >
              <Feather name="x" size={13} color={colors.muted} />
              <AppText style={styles.removePhotoText}>Quitar foto</AppText>
            </Pressable>
          ) : null}

          <View style={styles.field}>
            <TextField
              label="Nombre del producto"
              value={name}
              onChangeText={(value) => {
                setName(value);
                clearError('name');
              }}
              placeholder="Ej. Auriculares Pro X"
              icon="package"
              error={errors.name}
            />
          </View>

          <View style={styles.field}>
            <TextField
              label="SKU"
              value={sku}
              onChangeText={(value) => {
                setSku(value.toUpperCase());
                clearError('sku');
              }}
              placeholder="Ej. AUD-006"
              icon="hash"
              autoCapitalize="characters"
              error={errors.sku}
            />
          </View>

          <View style={styles.field}>
            <SelectField
              label="Categoría"
              value={category}
              onChange={(value) => {
                setCategory(value);
                clearError('category');
              }}
              placeholder="Selecciona una categoría"
              options={CATEGORY_OPTIONS}
              error={errors.category}
              sheetTitle="Categoría del producto"
            />
          </View>

          <View style={styles.field}>
            <TextField
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Color, materiales o detalles del producto"
              multiline
              height={88}
              maxLength={220}
            />
          </View>

          <View style={styles.field}>
            <TextField
              label="Precio unitario"
              value={price}
              onChangeText={(value) => {
                setPrice(value);
                clearError('price');
              }}
              placeholder="Ej. 599.90"
              icon="dollar-sign"
              keyboardType="decimal-pad"
              autoCapitalize="none"
              error={errors.price}
            />
          </View>

          <View style={styles.doubleRow}>
            <View style={styles.doubleItem}>
              <TextField
                label={isEdit ? 'Stock actual' : 'Stock inicial'}
                value={stock}
                onChangeText={(value) => {
                  setStock(value.replace(/[^0-9]/g, ''));
                  clearError('stock');
                }}
                placeholder="0"
                keyboardType="number-pad"
                error={errors.stock}
              />
            </View>
            <View style={styles.doubleItem}>
              <TextField
                label="Stock mínimo"
                value={minStock}
                onChangeText={(value) => {
                  setMinStock(value.replace(/[^0-9]/g, ''));
                  clearError('minStock');
                }}
                placeholder="5"
                keyboardType="number-pad"
                error={errors.minStock}
              />
            </View>
          </View>

          <View style={styles.field}>
            <TextField
              label="Ubicación (opcional)"
              value={location}
              onChangeText={setLocation}
              placeholder="Ej. Pasillo A · Estante 3"
              icon="map-pin"
            />
          </View>

          <View style={styles.preview}>
            <View style={styles.previewTop}>
              <AppText style={styles.previewLabel}>Precio</AppText>
              <AppText weight="bold" style={styles.previewValue}>
                {Number.isNaN(priceValue) || priceValue <= 0
                  ? '—'
                  : formatMoney(priceValue)}
              </AppText>
            </View>
            <View style={styles.previewStatus}>
              <Feather
                name={statusText.icon}
                size={16}
                color={
                  statusText.tone === 'ok'
                    ? colors.greenText
                    : statusText.tone === 'low'
                      ? colors.amberText
                      : colors.muted
                }
              />
              <AppText
                style={[
                  styles.previewStatusText,
                  {
                    color:
                      statusText.tone === 'ok'
                        ? colors.greenText
                        : statusText.tone === 'low'
                          ? colors.amberText
                          : colors.muted,
                  },
                ]}
              >
                {statusText.text}
              </AppText>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={isEdit ? 'Guardar cambios' : 'Guardar producto'}
            icon="check"
            onPress={save}
            loading={saving}
          />
          <AppText style={styles.responsible}>
            {isEdit
              ? 'Los cambios se guardarán y el ajuste de stock quedará registrado'
              : 'El producto se añadirá al inventario de Ana García'}
          </AppText>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  photoCard: {
    minHeight: 88,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  photoInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  photoTitle: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.ink,
  },
  photoText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 4,
  },
  removePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },
  removePhotoText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
    marginLeft: 4,
  },
  field: {
    marginTop: 20,
  },
  doubleRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  doubleItem: {
    flex: 1,
  },
  preview: {
    marginTop: 22,
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
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
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
  notFound: {
    flex: 1,
  },
});
