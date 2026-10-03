import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface RadioProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Radio: React.FC<RadioProps> = ({
  selected,
  onSelect,
  label,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onSelect}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.circle,
          {
            borderColor: selected ? theme.colors.primary : theme.colors.border,
          },
        ]}
      >
        {selected && (
          <View
            style={[
              styles.innerDot,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        )}
      </View>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 15,
  },
});
