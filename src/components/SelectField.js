import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from './AppText';
import BottomSheet from './BottomSheet';
import { colors, radii } from '../theme';

export default function SelectField({
  label,
  value,
  placeholder = 'Selecciona una opción',
  options,
  onChange,
  error,
  style,
  sheetTitle,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={style}>
      {label ? (
        <AppText weight="semibold" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.input,
          error && styles.inputError,
          pressed && styles.pressed,
        ]}
      >
        <AppText
          style={[styles.value, !selected && styles.placeholder]}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </AppText>
        <Feather name="chevron-down" size={20} color={colors.muted} />
      </Pressable>
      {error ? (
        <AppText weight="medium" style={styles.error}>
          {error}
        </AppText>
      ) : null}

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={sheetTitle || label || 'Selecciona una opción'}
      >
        <View style={styles.options}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.option,
                  index < options.length - 1 && styles.optionBorder,
                  pressed && styles.optionPressed,
                ]}
              >
                <AppText
                  weight={isSelected ? 'semibold' : 'regular'}
                  style={styles.optionLabel}
                >
                  {option.label}
                </AppText>
                {isSelected ? (
                  <Feather name="check" size={18} color={colors.ink} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.inkSoft,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: colors.amberText,
  },
  pressed: {
    opacity: 0.75,
  },
  value: {
    flex: 1,
    fontSize: 14,
    lineHeight: 17,
    paddingRight: 10,
  },
  placeholder: {
    color: colors.placeholder,
  },
  error: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.amberText,
    marginTop: 6,
  },
  options: {
    paddingTop: 4,
  },
  option: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionPressed: {
    opacity: 0.6,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
    paddingRight: 12,
  },
});
