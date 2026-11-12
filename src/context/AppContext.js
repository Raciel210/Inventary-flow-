import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createSeedMovements,
  createSeedProducts,
  CURRENT_USER,
} from '../data/seed';
import { makeId } from '../utils/format';

const STORAGE_KEY = '@inventory_flow/data';
const DATA_VERSION = 1;

const AppContext = createContext(null);

function createFreshData() {
  const seededProducts = createSeedProducts();
  return {
    products: seededProducts,
    movements: createSeedMovements(seededProducts),
    user: null,
    settings: { notifications: true },
  };
}

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({ notifications: true });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.version === DATA_VERSION) {
            if (active) {
              setProducts(parsed.products || []);
              setMovements(parsed.movements || []);
              setUser(parsed.user || null);
              setSettings(parsed.settings || { notifications: true });
              return;
            }
          }
        }

        const fresh = createFreshData();
        if (active) {
          setProducts(fresh.products);
          setMovements(fresh.movements);
          setUser(fresh.user);
          setSettings(fresh.settings);
        }
      } catch (error) {
        const fresh = createFreshData();
        if (active) {
          setProducts(fresh.products);
          setMovements(fresh.movements);
          setUser(fresh.user);
          setSettings(fresh.settings);
        }
      } finally {
        if (active) setReady(true);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload = {
      version: DATA_VERSION,
      products,
      movements,
      user,
      settings,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [ready, products, movements, user, settings]);

  const login = useCallback((email) => {
    setUser({
      ...CURRENT_USER,
      email: email.trim().toLowerCase() || CURRENT_USER.email,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const registerMovement = useCallback(
    ({ productId, type, quantity, reason, note }) => {
      const product = products.find((item) => item.id === productId);
      if (!product) {
        return { ok: false, error: 'Selecciona un producto válido.' };
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return { ok: false, error: 'La cantidad debe ser mayor a cero.' };
      }
      if (type === 'salida' && quantity > product.stock) {
        return {
          ok: false,
          error: `Solo hay ${product.stock} unidades disponibles.`,
        };
      }
      if (!reason) {
        return { ok: false, error: 'Selecciona un motivo para el movimiento.' };
      }

      const newStock =
        type === 'entrada' ? product.stock + quantity : product.stock - quantity;
      const now = new Date().toISOString();
      const movement = {
        id: makeId('m'),
        productId,
        type,
        quantity,
        reason,
        note: note.trim(),
        date: now,
        responsible: CURRENT_USER.name,
      };

      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, stock: newStock, updatedAt: now }
            : item,
        ),
      );
      setMovements((prev) => [movement, ...prev]);

      return { ok: true, movement, newStock };
    },
    [products],
  );

  const addProduct = useCallback((data) => {
    const now = new Date().toISOString();
    const product = {
      id: makeId('p'),
      name: data.name.trim(),
      sku: data.sku.trim().toUpperCase(),
      category: data.category,
      categoryId: data.categoryId,
      stock: Number(data.stock) || 0,
      minStock: Number(data.minStock) || 0,
      price: Number(data.price) || 0,
      location: data.location.trim(),
      description: data.description.trim(),
      icon: data.icon,
      photo: data.photo || null,
      createdAt: now,
    };

    setProducts((prev) => [product, ...prev]);

    if (product.stock > 0) {
      const movement = {
        id: makeId('m'),
        productId: product.id,
        type: 'entrada',
        quantity: product.stock,
        reason: 'Inventario inicial',
        note: 'Alta de producto',
        date: now,
        responsible: CURRENT_USER.name,
      };
      setMovements((prev) => [movement, ...prev]);
    }

    return product;
  }, []);

  const updateProduct = useCallback(
    (productId, data) => {
      const previous = products.find((item) => item.id === productId);
      if (!previous) return null;

      const now = new Date().toISOString();
      const nextStock = Number(data.stock) || 0;
      const updated = {
        ...previous,
        name: data.name.trim(),
        sku: data.sku.trim().toUpperCase(),
        category: data.category,
        categoryId: data.categoryId,
        stock: nextStock,
        minStock: Number(data.minStock) || 0,
        price: Number(data.price) || 0,
        location: data.location.trim(),
        description: data.description.trim(),
        icon: data.icon,
        photo: data.photo || null,
        updatedAt: now,
      };

      setProducts((prev) =>
        prev.map((item) => (item.id === productId ? updated : item)),
      );

      if (nextStock !== previous.stock) {
        const difference = Math.abs(nextStock - previous.stock);
        const movement = {
          id: makeId('m'),
          productId,
          type: nextStock > previous.stock ? 'entrada' : 'salida',
          quantity: difference,
          reason: 'Ajuste de inventario',
          note: 'Actualización de ficha de producto',
          date: now,
          responsible: CURRENT_USER.name,
        };
        setMovements((prev) => [movement, ...prev]);
      }

      return updated;
    },
    [products],
  );

  const deleteProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setMovements((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const toggleNotifications = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  }, []);

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= product.minStock),
    [products],
  );

  const totalUnits = useMemo(
    () => products.reduce((sum, product) => sum + product.stock, 0),
    [products],
  );

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products],
  );

  const sortedMovements = useMemo(
    () =>
      [...movements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [movements],
  );

  const value = useMemo(
    () => ({
      ready,
      products,
      movements: sortedMovements,
      user,
      settings,
      totalUnits,
      categories,
      lowStockProducts,
      login,
      logout,
      registerMovement,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleNotifications,
    }),
    [
      ready,
      products,
      sortedMovements,
      user,
      settings,
      totalUnits,
      categories,
      lowStockProducts,
      login,
      logout,
      registerMovement,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleNotifications,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}

export { STORAGE_KEY, DATA_VERSION };
