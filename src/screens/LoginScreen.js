import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import BottomSheet from '../components/BottomSheet';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { useApp } from '../context/AppContext';
import { DEMO_CREDENTIALS } from '../data/seed';
import { colors, fonts, radii } from '../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (nextEmail = email, nextPassword = password) => {
    Keyboard.dismiss();
    const cleanEmail = nextEmail.trim();
    let valid = true;

    if (!cleanEmail) {
      setEmailError('Ingresa tu correo electrónico.');
      valid = false;
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      setEmailError('Ingresa un correo electrónico válido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!nextPassword) {
      setPasswordError('Ingresa tu contraseña.');
      valid = false;
    } else if (nextPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    login(cleanEmail);
    setLoading(false);
  };

  const useDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setEmailError('');
    setPasswordError('');
    submit(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  };

  const contactAdmin = async () => {
    const url = 'mailto:soporte@inventoryflow.com?subject=Acceso%20a%20Inventory%20Flow';
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Contacta a tu administrador',
        'Escríbenos a soporte@inventoryflow.com para solicitar acceso.',
      );
    }
  };

  const sendRecovery = async () => {
    const clean = recoverEmail.trim();
    if (!EMAIL_REGEX.test(clean)) {
      setRecoverError('Ingresa un correo electrónico válido.');
      return;
    }
    setRecoverError('');
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 550));
    setSending(false);
    setRecoverOpen(false);
    setRecoverEmail('');
    Alert.alert(
      'Revisa tu correo',
      `Enviamos las instrucciones de recuperación a ${clean}.`,
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.identity}>
            <View style={styles.logo}>
              <Feather name="package" size={36} color={colors.surface} />
            </View>
            <View style={styles.presentation}>
              <AppText weight="bold" style={styles.appName}>
                Inventory Flow
              </AppText>
              <AppText style={styles.tagline}>
                Ingresa tus credenciales para administrar tu inventario
              </AppText>
            </View>
          </View>

          <View style={styles.form}>
            <TextField
              label="Correo Electrónico"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError('');
              }}
              placeholder="ejemplo@empresa.com"
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              error={emailError}
            />

            <View style={styles.passwordGroup}>
              <TextField
                label="Contraseña"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Ingresa tu contraseña"
                icon="lock"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={() => submit()}
                error={passwordError}
                rightElement={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    onPress={() => setShowPassword((prev) => !prev)}
                    hitSlop={10}
                    style={styles.eyeButton}
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.muted}
                    />
                  </Pressable>
                }
              />
              <Pressable
                accessibilityRole="link"
                onPress={() => {
                  setRecoverEmail(email);
                  setRecoverError('');
                  setRecoverOpen(true);
                }}
                style={styles.forgotButton}
              >
                <AppText weight="medium" style={styles.forgotText}>
                  ¿Olvidaste tu contraseña?
                </AppText>
              </Pressable>
            </View>

            <Button
              label="Iniciar sesión"
              onPress={() => submit()}
              loading={loading}
              style={styles.loginButton}
            />

            <Pressable
              accessibilityRole="button"
              onPress={useDemo}
              style={styles.demoButton}
            >
              <AppText weight="semibold" style={styles.demoText}>
                Probar con cuenta demo
              </AppText>
              <Feather name="arrow-right" size={14} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.help}>
            <AppText style={styles.helpText}>
              ¿Necesitas acceso a tu empresa?
            </AppText>
            <Pressable
              accessibilityRole="link"
              onPress={contactAdmin}
              style={styles.contactButton}
            >
              <AppText weight="semibold" style={styles.contactText}>
                Contacta a tu administrador
              </AppText>
            </Pressable>
          </View>

          <View style={styles.trust}>
            <Feather name="shield" size={16} color={colors.muted} />
            <AppText style={styles.trustText}>
              Tu inventario, siempre protegido.
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet
        visible={recoverOpen}
        onClose={() => setRecoverOpen(false)}
        title="Recuperar contraseña"
        subtitle="Te enviaremos un enlace para restablecer tu acceso."
      >
        <View style={styles.recoverContent}>
          <TextField
            label="Correo Electrónico"
            value={recoverEmail}
            onChangeText={(value) => {
              setRecoverEmail(value);
              if (recoverError) setRecoverError('');
            }}
            placeholder="ejemplo@empresa.com"
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            error={recoverError}
            returnKeyType="send"
            onSubmitEditing={sendRecovery}
          />
          <Button
            label="Enviar instrucciones"
            icon="send"
            onPress={sendRecovery}
            loading={sending}
            style={styles.recoverButton}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  identity: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
    paddingBottom: 36,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presentation: {
    marginTop: 18,
  },
  appName: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 12,
    fontFamily: fonts.regular,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 24,
  },
  passwordGroup: {
    marginTop: 20,
  },
  eyeButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 2,
  },
  forgotText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
  },
  loginButton: {
    marginTop: 20,
  },
  demoButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  demoText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
    marginRight: 5,
  },
  help: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  helpText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  contactButton: {
    marginTop: 8,
    paddingVertical: 2,
  },
  contactText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
    textAlign: 'center',
  },
  trust: {
    marginTop: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  trustText: {
    fontSize: 11,
    lineHeight: 13,
    color: colors.muted,
    marginLeft: 6,
  },
  recoverContent: {
    paddingTop: 6,
  },
  recoverButton: {
    marginTop: 18,
  },
});
