import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { Modal } from './Modal';
import { Button } from './Button';

export interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} onClose={onCancel}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.lg,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.textMuted,
            fontSize: theme.typography.fontSize.sm,
          },
        ]}
      >
        {message}
      </Text>
      <View style={styles.buttonRow}>
        <Button
          title={cancelText}
          onPress={onCancel}
          variant="ghost"
          size="sm"
          style={styles.btn}
        />
        <Button
          title={confirmText}
          onPress={onConfirm}
          variant={isDestructive ? 'danger' : 'primary'}
          size="sm"
          style={styles.btn}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btn: {
    minWidth: 80,
  },
});
