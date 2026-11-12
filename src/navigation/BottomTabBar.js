import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { colors, layout } from '../theme';

const TABS = {
  InicioTab: { label: 'Inicio', icon: 'home' },
  InventarioTab: { label: 'Inventario', icon: 'layers' },
  MovimientosTab: { label: 'Movimientos', icon: 'repeat' },
  CuentaTab: { label: 'Cuenta', icon: 'user' },
};

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          height: layout.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TABS[route.name] || { label: route.name, icon: 'circle' };
        const descriptor = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (event.defaultPrevented) return;

          if (route.name === 'InventarioTab') {
            // The inventory tab always opens the catalog, never a stale detail.
            navigation.navigate(route.name, { screen: 'InventoryList' });
            return;
          }

          if (!focused) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={descriptor.options.tabBarAccessibilityLabel || meta.label}
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          >
            <Feather
              name={meta.icon}
              size={23}
              color={focused ? colors.ink : colors.placeholder}
            />
            <AppText
              weight={focused ? 'semibold' : 'regular'}
              style={[
                styles.label,
                { color: focused ? colors.ink : colors.muted },
              ]}
            >
              {meta.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  item: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pressed: {
    opacity: 0.55,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    marginTop: 5,
  },
});
