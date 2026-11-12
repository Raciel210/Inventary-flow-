import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AppText from './AppText';
import Button from './Button';
import IconButton from './IconButton';
import TextField from './TextField';
import { colors, radii } from '../theme';

const BARCODE_TYPES = [
  'qr',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code128',
  'code39',
  'code93',
  'itf14',
  'codabar',
];

export default function ScannerModal({ visible, onClose, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualCode, setManualCode] = useState('');
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setManualCode('');
      setScanned(false);
    }
  }, [visible]);

  const submit = (code) => {
    const clean = String(code || '').trim();
    if (!clean) return;
    setScanned(true);
    onScanned(clean);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
          <View>
            <AppText weight="bold" style={styles.title}>
              Escanear código
            </AppText>
            <AppText style={styles.subtitle}>
              Apunta la cámara al código de barras
            </AppText>
          </View>
          <IconButton
            name="x"
            size={24}
            color={colors.surface}
            onPress={onClose}
            accessibilityLabel="Cerrar escáner"
          />
        </View>

        <View style={styles.cameraWrap}>
          {!permission ? (
            <View style={styles.permissionBox}>
              <ActivityIndicator color={colors.surface} />
            </View>
          ) : permission.granted ? (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
              onBarcodeScanned={
                scanned ? undefined : (result) => submit(result?.data)
              }
            />
          ) : (
            <View style={styles.permissionBox}>
              <View style={styles.permissionIcon}>
                <Feather name="camera-off" size={28} color={colors.surface} />
              </View>
              <AppText weight="semibold" style={styles.permissionTitle}>
                Necesitamos acceso a la cámara
              </AppText>
              <AppText style={styles.permissionText}>
                Permite el uso de la cámara para escanear códigos de barras o
                ingresa el código manualmente.
              </AppText>
              <Button
                label="Permitir cámara"
                variant="secondary"
                onPress={requestPermission}
                style={styles.permissionButton}
              />
              {permission.canAskAgain === false ? (
                <Pressable onPress={() => Linking.openSettings()} style={styles.settingsLink}>
                  <AppText weight="semibold" style={styles.settingsText}>
                    Abrir ajustes del teléfono
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          )}

          {permission?.granted ? (
            <>
              <View pointerEvents="none" style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
              <View pointerEvents="none" style={styles.scanHint}>
                <AppText weight="medium" style={styles.scanHintText}>
                  Mantén el código dentro del marco
                </AppText>
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.manual}>
          <AppText weight="semibold" style={styles.manualTitle}>
            ¿No puedes escanear?
          </AppText>
          <AppText style={styles.manualText}>
            Escribe el SKU del producto para buscarlo en el inventario.
          </AppText>
          <TextField
            value={manualCode}
            onChangeText={setManualCode}
            placeholder="Ej. AUD-001"
            icon="hash"
            autoCapitalize="characters"
            returnKeyType="search"
            onSubmitEditing={() => submit(manualCode)}
            style={styles.manualInput}
          />
          <Button
            label="Buscar código"
            icon="search"
            variant="secondary"
            onPress={() => submit(manualCode)}
            disabled={!manualCode.trim()}
          />
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.surface,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.border,
    marginTop: 4,
  },
  cameraWrap: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionBox: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  permissionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 15,
    lineHeight: 19,
    color: colors.surface,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.border,
    textAlign: 'center',
    marginTop: 8,
  },
  permissionButton: {
    marginTop: 18,
    minWidth: 180,
  },
  settingsLink: {
    marginTop: 14,
    padding: 4,
  },
  settingsText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.border,
    textDecorationLine: 'underline',
  },
  scanFrame: {
    width: 230,
    height: 230,
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.surface,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanHint: {
    position: 'absolute',
    bottom: 18,
    backgroundColor: colors.scrim,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  scanHintText: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.surface,
  },
  manual: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 6,
  },
  manualTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.surface,
  },
  manualText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.border,
    marginTop: 4,
    marginBottom: 10,
  },
  manualInput: {
    marginBottom: 12,
  },
});
