import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { DynamicHomeScreen } from '@dailyapps/ui';
import { useTheme, useThemeContext } from '@dailyapps/theme';
import { useAppStorage } from '@dailyapps/storage';
import { useAnalytics } from '@dailyapps/analytics';
import { BannerAd } from '@dailyapps/ads';
import { AppFeature } from '@dailyapps/config';
import { qrbarcodeConfig } from '../config/app.config';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();
  const storage = useAppStorage();
  const analytics = useAnalytics();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    async function loadPreferences() {
      const favs = await storage.getFavorites();
      const rec = await storage.getRecentTools();
      setFavorites(favs);
      setRecents(rec);
    }
    loadPreferences();
    analytics.logScreenView('DailyQrBarcodeHome');
  }, [storage, analytics]);

  const handleSelectFeature = async (feature: AppFeature) => {
    analytics.logToolOpened(feature.id, { tool_name: feature.title });
    const updatedRecents = await storage.addRecentTool(feature.id);
    setRecents(updatedRecents);
    navigation.navigate(feature.route, { feature });
  };

  const handleToggleFavorite = async (featureId: string) => {
    const updated = await storage.toggleFavorite(featureId);
    setFavorites(updated);
  };

  return (
    <DynamicHomeScreen
      appName={qrbarcodeConfig.displayName}
      subtitle="Fast QR & barcode scanner, generator & history"
      features={qrbarcodeConfig.features}
      favoriteIds={favorites}
      recentIds={recents}
      onSelectFeature={handleSelectFeature}
      onToggleFavorite={handleToggleFavorite}
      headerRightAction={
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.surfaceSubtle,
          }}
        >
          <Text style={{ fontSize: 16 }}>{theme.isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      }
      bannerAdSlot={<BannerAd placement="qr-barcode_home_bottom" />}
    />
  );
};
