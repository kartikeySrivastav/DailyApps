import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { ALL_INDIAN_LANGUAGES, SupportedLanguage } from '@dailyapps/utils';

interface LanguageSelectionModalProps {
  visible: boolean;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onClose: () => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surfaceCard, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                🌐 Select Language / भाषा चुनें
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Choose from 15 popular Indian languages
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ fontSize: 18, color: theme.colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.langList} showsVerticalScrollIndicator={false}>
            {ALL_INDIAN_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  style={[
                    styles.langRow,
                    { borderBottomColor: theme.colors.border },
                    isSelected && { backgroundColor: theme.colors.surfaceSubtle },
                  ]}
                >
                  <View style={styles.flagWrap}>
                    <Text style={{ fontSize: 22 }}>{lang.flag}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.nativeName,
                        { color: isSelected ? theme.colors.primary : theme.colors.text },
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                    <Text style={[styles.englishName, { color: theme.colors.textMuted }]}>
                      {lang.englishName} ({lang.script})
                    </Text>
                  </View>
                  {isSelected && (
                    <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  langList: {
    maxHeight: 400,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderRadius: 8,
    gap: 12,
  },
  flagWrap: {
    width: 36,
    alignItems: 'center',
  },
  nativeName: {
    fontSize: 15,
    fontWeight: '700',
  },
  englishName: {
    fontSize: 12,
    marginTop: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '800',
  },
});
