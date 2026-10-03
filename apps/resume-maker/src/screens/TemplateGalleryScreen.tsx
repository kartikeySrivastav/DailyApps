import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { ScreenContainer, Header, Card, Button, SegmentedControl } from '@dailyapps/ui';
import { RESUME_TEMPLATES, BIODATA_TEMPLATES, TemplateMeta } from '../templates/templateCatalog';
import { sampleGroomBiodata } from '../data/sampleData';
import { createEmptyResume } from '../data/documentDefaults';

interface Props {
  navigation: any;
}

export const TemplateGalleryScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);

  const templates: TemplateMeta[] = activeTab === 0 ? BIODATA_TEMPLATES : RESUME_TEMPLATES;

  const handleUseTemplate = (tpl: TemplateMeta) => {
    if (tpl.category === 'marriage_biodata') {
      const doc = {
        ...sampleGroomBiodata,
        id: 'bio_' + Date.now(),
        templateId: tpl.id as any,
        accentColor: tpl.primaryColor,
      };
      navigation.navigate('MarriageBiodataBuilder', { document: doc });
    } else {
      const doc = createEmptyResume(tpl.id as any, tpl.primaryColor);
      navigation.navigate('ResumeBuilder', { document: doc });
    }
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <Header
        title="🎨 Template Studio"
        subtitle="Explore Premium Resumes & Matrimonial Layouts"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.segmentContainer}>
        <SegmentedControl
          options={['💍 विवाह बायोडाटा', '💼 Career Resumes']}
          selectedIndex={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {templates.map((tpl) => (
          <Card key={tpl.id} variant="elevated" style={styles.tplCard}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: tpl.primaryColor + '15' }]}>
                <Text style={[styles.badgeText, { color: tpl.primaryColor }]}>{tpl.badge}</Text>
              </View>
              <View style={[styles.colorDot, { backgroundColor: tpl.primaryColor }]} />
            </View>

            <Text style={[styles.tplName, { color: theme.colors.text }]}>{tpl.name}</Text>
            <Text style={[styles.tplDesc, { color: theme.colors.textMuted }]}>
              {tpl.description}
            </Text>

            <View style={[styles.recBox, { backgroundColor: theme.colors.surfaceSubtle }]}>
              <Text style={[styles.recLabel, { color: theme.colors.textMuted }]}>
                Recommended for:
              </Text>
              <Text style={[styles.recVal, { color: theme.colors.text }]}>
                {tpl.recommendedFor}
              </Text>
            </View>

            <Button
              title="🚀 Use This Template"
              variant="primary"
              onPress={() => handleUseTemplate(tpl)}
            />
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  tplCard: {
    padding: 18,
    borderRadius: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  tplName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  tplDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  recBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  recLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recVal: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
});
