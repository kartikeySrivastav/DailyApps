import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';

export interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  withPadding?: boolean;
  safeArea?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  withPadding = true,
  safeArea = true,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: withPadding ? theme.spacing.lg : 0,
  };

  const ContentWrapper = safeArea ? SafeAreaView : View;
  const androidTopPadding = safeArea && Platform.OS === 'android' ? Math.max(StatusBar.currentHeight || 0, 38) : 0;

  return (
    <ContentWrapper
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          paddingTop: androidTopPadding,
        },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {scrollable ? (
        <ScrollView
          style={[containerStyle, style]}
          contentContainerStyle={[
            { paddingVertical: withPadding ? theme.spacing.lg : 0 },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[containerStyle, { paddingVertical: withPadding ? theme.spacing.lg : 0 }, style]}>
          {children}
        </View>
      )}
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
