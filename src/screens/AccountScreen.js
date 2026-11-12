import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { MainHeader } from '../components/Header';
import AppText from '../components/AppText';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { colors, radii } from '../theme';
import { formatNumber, initials } from '../utils/format';

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <AppText weight="bold" style={styles.statValue}>
        {value}
      </AppText>
      <AppText style={styles.statLabel}>{label}</AppText>
    </View>
  );
}

export default function AccountScreen() {
  const {
    user,
    products,
    movements,
    lowStockProducts,
    settings,
    toggleNotifications,
    logout,
  } = useApp();

  const confirmLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Deseas salir de Inventory Flow? Tus datos permanecerán guardados en este dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
      ],
    );
  };

  const showAbout = () => {
    Alert.alert(
      'Inventory Flow',
      'Control de inventario para tu almacén.\n\nVersión 1.0.0',
    );
  };

  return (
    <Screen>
      <MainHeader title="Cuenta" subtitle="Perfil y preferencias" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppText weight="bold" style={styles.avatarText}>
              {initials(user?.name || 'Ana García')}
            </AppText>
          </View>
          <View style={styles.profileInfo}>
            <AppText weight="bold" style={styles.profileName}>
              {user?.name || 'Ana García'}
            </AppText>
            <AppText style={styles.profileEmail} numberOfLines={1}>
              {user?.email || 'ana.garcia@inventoryflow.com'}
            </AppText>
            <View style={styles.roleRow}>
              <View style={styles.activeDot} />
              <AppText style={styles.roleText}>
                {user?.role || 'Administradora'} · {user?.warehouse || 'Almacén central'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Stat value={formatNumber(products.length)} label="Productos" />
          <View style={styles.statDivider} />
          <Stat value={formatNumber(movements.length)} label="Movimientos" />
          <View style={styles.statDivider} />
          <Stat value={formatNumber(lowStockProducts.length)} label="Alertas" />
        </View>

        <AppText weight="bold" style={styles.sectionTitle}>
          Preferencias
        </AppText>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Feather name="bell" size={18} color={colors.ink} />
            </View>
            <View style={styles.settingInfo}>
              <AppText weight="semibold" style={styles.settingTitle}>
                Alertas de stock bajo
              </AppText>
              <AppText style={styles.settingText}>
                Mostrar avisos y el indicador en Inicio
              </AppText>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.green }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={showAbout}
            style={({ pressed }) => [
              styles.settingRow,
              styles.settingRowBorder,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.settingIcon}>
              <Feather name="info" size={18} color={colors.ink} />
            </View>
            <View style={styles.settingInfo}>
              <AppText weight="semibold" style={styles.settingTitle}>
                Acerca de Inventory Flow
              </AppText>
              <AppText style={styles.settingText}>Versión 1.0.0</AppText>
            </View>
            <Feather name="chevron-right" size={16} color={colors.placeholder} />
          </Pressable>
        </View>

        <AppText weight="bold" style={styles.sectionTitle}>
          Sesión
        </AppText>

        <Button
          label="Cerrar sesión"
          icon="log-out"
          variant="secondary"
          onPress={confirmLogout}
          style={styles.logoutButton}
        />

        <AppText style={styles.footerText}>
          Inventory Flow · Control de inventario móvil
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    lineHeight: 26,
    color: colors.surface,
    letterSpacing: -0.5,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 4,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 100,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  roleText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
    color: colors.muted,
  },
  statsCard: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.muted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 19,
    marginTop: 24,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
  },
  settingRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.ink,
  },
  settingText: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 3,
  },
  pressed: {
    opacity: 0.65,
  },
  logoutButton: {
    marginTop: 2,
  },
  footerText: {
    marginTop: 26,
    fontSize: 10,
    lineHeight: 13,
    color: colors.placeholder,
    textAlign: 'center',
  },
});
