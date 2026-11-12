import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import BottomTabBar from './BottomTabBar';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import MovementScreen from '../screens/MovementScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import MovementsScreen from '../screens/MovementsScreen';
import AccountScreen from '../screens/AccountScreen';
import AlertsScreen from '../screens/AlertsScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const InventoryStack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    primary: colors.ink,
  },
};

function InventoryStackScreen() {
  return (
    <InventoryStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <InventoryStack.Screen name="InventoryList" component={InventoryScreen} />
      <InventoryStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </InventoryStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen name="InicioTab" component={HomeScreen} />
      <Tab.Screen
        name="InventarioTab"
        component={InventoryStackScreen}
        options={{ popToTopOnBlur: true }}
      />
      <Tab.Screen name="MovimientosTab" component={MovementsScreen} />
      <Tab.Screen name="CuentaTab" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, ready } = useApp();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: 'fade' }}
          />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen
              name="Movement"
              component={MovementScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <RootStack.Screen
              name="ProductForm"
              component={ProductFormScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <RootStack.Screen
              name="Alerts"
              component={AlertsScreen}
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
