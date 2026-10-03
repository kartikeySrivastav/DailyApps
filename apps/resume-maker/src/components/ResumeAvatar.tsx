import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  photoUri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
  badgeBorderColor?: string;
}

const LOGO_EMOJIS: Record<string, string> = {
  'logo:tech': '💻',
  'logo:corp': '🏢',
  'logo:univ': '🏛️',
  'logo:cloud': '☁️',
  'logo:shield': '🛡️',
  'logo:startup': '🚀',
  'logo:finance': '⚖️',
  'logo:creative': '🎨',
};

export const ResumeAvatar: React.FC<Props> = ({
  photoUri,
  name = 'Rahul Sharma',
  size = 64,
  style,
  badgeBorderColor = '#FFFFFF',
}) => {
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'RS';

  const isRemote =
    photoUri?.startsWith('http://') ||
    photoUri?.startsWith('https://') ||
    photoUri?.startsWith('file://') ||
    photoUri?.startsWith('data:');

  const isMonogram = photoUri?.startsWith('monogram:');
  const isLogo = photoUri?.startsWith('logo:');

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: badgeBorderColor,
    overflow: 'hidden' as const,
  };

  if (isRemote) {
    return (
      <View style={[styles.container, circleStyle, style]}>
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  if (isLogo) {
    const icon = LOGO_EMOJIS[photoUri || ''] || '🏢';
    return (
      <View
        style={[
          styles.container,
          circleStyle,
          { backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
          style,
        ]}
      >
        <Text style={{ fontSize: size * 0.48 }}>{icon}</Text>
      </View>
    );
  }

  if (isMonogram) {
    const parts = photoUri?.split(':') || [];
    const text = parts[1] || initials;
    const bg = parts[2] || '#2563EB';
    return (
      <View
        style={[
          styles.container,
          circleStyle,
          { backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
          style,
        ]}
      >
        <Text style={{ fontSize: size * 0.38, fontWeight: '800', color: '#FFFFFF' }}>{text}</Text>
      </View>
    );
  }

  if (photoUri && photoUri.length <= 4) {
    return (
      <View
        style={[
          styles.container,
          circleStyle,
          { backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
          style,
        ]}
      >
        <Text style={{ fontSize: size * 0.48 }}>{photoUri}</Text>
      </View>
    );
  }

  // Fallback Initials Monogram Badge
  return (
    <View
      style={[
        styles.container,
        circleStyle,
        { backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.38, fontWeight: '800', color: '#FFFFFF' }}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
