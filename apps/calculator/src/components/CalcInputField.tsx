import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface CalcInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  rightElement?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  maxLength?: number;
  style?: ViewStyle;
}

export const CalcInputField: React.FC<CalcInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  prefix,
  suffix,
  rightElement,
  helperText,
  errorText,
  keyboardType = 'numeric',
  editable = true,
  maxLength,
  style,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = errorText
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary
    : theme.isDark
    ? 'rgba(255, 255, 255, 0.15)'
    : '#CBD5E1';

  const bgColor = theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC';
  const textColor = theme.colors.text;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.isDark ? '#CBD5E1' : '#475569' }]}>
          {label}
        </Text>
        {rightElement}
      </View>

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: bgColor,
            borderColor,
          },
        ]}
      >
        {prefix ? (
          <Text
            style={[
              styles.affixText,
              { color: theme.isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            {prefix}
          </Text>
        ) : null}

        <TextInput
          style={[
            styles.input,
            { color: textColor },
            !editable && { opacity: 0.7 },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.isDark ? '#64748B' : '#94A3B8'}
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {suffix ? (
          <Text
            style={[
              styles.affixText,
              { color: theme.isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            {suffix}
          </Text>
        ) : null}
      </View>

      {errorText ? (
        <Text style={[styles.messageText, { color: theme.colors.error }]}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.messageText,
            { color: theme.isDark ? '#94A3B8' : '#64748B' },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 12,
    height: 50,
  },
  affixText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 0,
  },
  messageText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
