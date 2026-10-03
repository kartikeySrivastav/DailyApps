import React from 'react';
import {
  Switch as RNSwitch,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.isDark ? '#334155' : '#cbd5e1',
          true: theme.colors.primary,
        }}
        thumbColor={value ? '#ffffff' : '#f8fafc'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
});
