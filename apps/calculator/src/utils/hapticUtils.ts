/**
 * Haptic Feedback Utilities
 * 
 * Provides tactile feedback for user interactions throughout the calculator app.
 * Cross-platform support for iOS and Android with graceful fallbacks.
 * 
 * IMPORTANT: Requires 'react-native-haptic-feedback' package
 * Install: npm install react-native-haptic-feedback
 * 
 * Usage:
 * import { haptic } from '@/utils/hapticUtils';
 * haptic.light(); // For button taps
 * haptic.success(); // For successful operations
 */

import { Platform, Vibration } from 'react-native';

// Global preference flag (defaults to false for safe fallback on devices/builds without VIBRATE permission)
let hapticsGloballyEnabled = false;

export const setHapticsEnabled = (enabled: boolean) => {
  hapticsGloballyEnabled = enabled;
};

export const isHapticsEnabled = (): boolean => {
  return hapticsGloballyEnabled;
};

/**
 * Trigger haptic feedback with type
 */
const triggerHaptic = (
  type: 
    | 'impactLight' 
    | 'impactMedium' 
    | 'impactHeavy' 
    | 'notificationSuccess' 
    | 'notificationWarning' 
    | 'notificationError'
    | 'selection'
) => {
  if (!hapticsGloballyEnabled) return;

  // Graceful native vibration
  try {
    if (type === 'impactHeavy' || type === 'notificationError') {
      Vibration.vibrate(25);
    } else if (type === 'impactMedium' || type === 'notificationWarning') {
      Vibration.vibrate(15);
    } else {
      Vibration.vibrate(8);
    }
  } catch {
    // Ignore any vibration errors
  }
};

/**
 * Haptic Feedback API
 * Provides convenient methods for different interaction types
 */
export const haptic = {
  /**
   * Light impact - Use for:
   * - Number button taps in calculator
   * - List item selections
   * - Toggle switches
   */
  light: () => {
    triggerHaptic('impactLight');
  },

  /**
   * Medium impact - Use for:
   * - Operator button taps (+, -, ×, ÷)
   * - Tab switches
   * - Modal dismissals
   */
  medium: () => {
    triggerHaptic('impactMedium');
  },

  /**
   * Heavy impact - Use for:
   * - Delete/Clear button taps
   * - Critical actions
   * - Long press feedback
   */
  heavy: () => {
    triggerHaptic('impactHeavy');
  },

  /**
   * Success feedback - Use for:
   * - Calculation completed
   * - Item added to favorites
   * - Copy to clipboard success
   */
  success: () => {
    triggerHaptic('notificationSuccess');
  },

  /**
   * Warning feedback - Use for:
   * - Invalid input
   * - Approaching limits
   */
  warning: () => {
    triggerHaptic('notificationWarning');
  },

  /**
   * Error feedback - Use for:
   * - Calculation errors
   * - Division by zero
   * - Invalid operations
   */
  error: () => {
    triggerHaptic('notificationError');
  },

  /**
   * Selection feedback - Use for:
   * - Picker/Wheel scrolling
   * - Slider adjustments
   * - Continuous selections
   */
  selection: () => {
    triggerHaptic('selection');
  },

  /**
   * Check if haptic feedback is available on this device
   * @returns boolean
   */
  isAvailable: (): boolean => {
    return Platform.OS !== 'web';
  },
};

/**
 * Haptic feedback for specific calculator interactions
 * Pre-configured for common calculator use cases
 */
export const calculatorHaptics = {
  /**
   * Feedback for number button press (0-9)
   */
  numberPress: () => haptic.light(),

  /**
   * Feedback for operator button press (+, -, *, /)
   */
  operatorPress: () => haptic.medium(),

  /**
   * Feedback for equal button press (=)
   */
  equalsPress: () => haptic.heavy(),

  /**
   * Feedback for clear button press (C, AC)
   */
  clearPress: () => haptic.medium(),

  /**
   * Feedback for backspace button press
   */
  backspacePress: () => haptic.light(),

  /**
   * Feedback for memory operations (M+, M-, MR, MC)
   */
  memoryPress: () => haptic.medium(),

  /**
   * Feedback for calculation success
   */
  calculationSuccess: () => haptic.success(),

  /**
   * Feedback for calculation error (division by zero, etc.)
   */
  calculationError: () => haptic.error(),

  /**
   * Feedback for switching calculator mode
   */
  modeSwitch: () => haptic.selection(),

  /**
   * Feedback for history item selection
   */
  historySelect: () => haptic.light(),

  /**
   * Feedback for copying result
   */
  copyResult: () => haptic.success(),

  /**
   * Feedback for pasting value
   */
  pasteValue: () => haptic.light(),

  /**
   * Feedback for undo operation
   */
  undo: () => haptic.light(),

  /**
   * Feedback for redo operation
   */
  redo: () => haptic.medium(),
};

export const setHapticEnabled = setHapticsEnabled;
export const isHapticEnabled = isHapticsEnabled;

export default haptic;
