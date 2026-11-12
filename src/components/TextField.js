import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './AppText';
import { colors, fonts, radii } from '../theme';

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  iconFamily = 'Feather',
  rightElement,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'sentences',
  multiline = false,
  height,
  error,
  style,
  inputStyle,
  editable = true,
  maxLength,
  returnKeyType,
  onSubmitEditing,
  autoComplete,
  textContentType,
  onFocus,
  onBlur,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const Icon = iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Feather;

  return (
    <View style={style}>
      {label ? (
        <AppText weight="semibold" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.inputBox,
          multiline && {
            height: height || 76,
            alignItems: 'flex-start',
            paddingTop: 14,
          },
          focused && styles.inputBoxFocused,
          error && styles.inputBoxError,
        ]}
      >
        {icon ? (
          <View style={styles.iconWrap}>
            <Icon name={icon} size={20} color={colors.muted} />
          </View>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          multiline={multiline}
          editable={editable}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoComplete={autoComplete}
          textContentType={textContentType}
          selectionColor={colors.ink}
          allowFontScaling={false}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            styles.input,
            multiline && styles.multiline,
            !editable && { color: colors.muted },
            inputStyle,
          ]}
          {...rest}
        />
        {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
      </View>
      {error ? (
        <AppText style={styles.error} weight="medium">
          {error}
        </AppText>
      ) : null}
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
  inputBox: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputBoxFocused: {
    borderColor: colors.ink,
  },
  inputBoxError: {
    borderColor: colors.amberText,
  },
  iconWrap: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  multiline: {
    textAlignVertical: 'top',
    paddingVertical: 0,
    minHeight: 44,
  },
  right: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.amberText,
    marginTop: 6,
  },
});
