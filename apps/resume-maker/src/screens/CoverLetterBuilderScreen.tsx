import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@dailyapps/theme';
import { ScreenContainer, Header, Input, Button, Card, Section } from '@dailyapps/ui';
import { useAppStorage } from '@dailyapps/storage';
import { useAnalytics } from '@dailyapps/analytics';
import { CoverLetterProfile } from '../types/resume.types';
import { sampleCoverLetter } from '../data/sampleData';
import { ColorPalettePicker } from '../components/ColorPalettePicker';

const EMPTY_COVER_LETTER: CoverLetterProfile = {
  id: '',
  type: 'cover_letter',
  title: 'My Cover Letter',
  templateId: 'classic_letter',
  accentColor: '#1d4ed8',
  updatedAt: Date.now(),
  sender: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
  },
  recipient: {
    hiringManager: '',
    company: '',
    department: '',
    location: '',
  },
  date: new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }),
  targetRole: '',
  salutation: 'Dear Hiring Manager,',
  openingParagraph: '',
  bodyParagraph: '',
  closingParagraph: '',
  signOff: 'Sincerely,',
};

interface Props {
  navigation: any;
  route: any;
}

export const CoverLetterBuilderScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const storage = useAppStorage();
  const analytics = useAnalytics();

  const initialData: CoverLetterProfile =
    route.params?.document || { ...EMPTY_COVER_LETTER, id: 'cl_' + Date.now() };

  const [letter, setLetter] = useState<CoverLetterProfile>(initialData);

  const handleLoadSample = () => {
    setLetter({
      ...sampleCoverLetter,
      id: letter.id || 'cl_' + Date.now(),
      updatedAt: Date.now(),
    });
    Alert.alert('Loaded!', 'Sample cover letter details loaded.');
  };

  const handleSave = async () => {
    if (!letter.sender.name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }

    const updated: CoverLetterProfile = {
      ...letter,
      title: `${letter.sender.name} - Cover Letter (${letter.recipient.company || 'Application'})`,
      updatedAt: Date.now(),
    };

    try {
      const existing = await storage.getJson<CoverLetterProfile[]>('saved_documents', []);
      const filtered = existing.filter((d) => d.id !== updated.id);
      await storage.setJson('saved_documents', [updated, ...filtered]);
      analytics.logEvent('cover_letter_saved', { id: updated.id });
      Alert.alert('Saved', 'Cover letter saved successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = () => {
    if (!letter.sender.name.trim()) {
      Alert.alert('Notice', 'Please fill in your name before previewing.');
      return;
    }
    const current: CoverLetterProfile = {
      ...letter,
      title: `${letter.sender.name} - Cover Letter`,
      updatedAt: Date.now(),
    };
    navigation.navigate('DocumentPreview', { document: current });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <Header
        title="✉️ Cover Letter Builder"
        subtitle="Generate Tailored Job Application Letters"
        onBack={() => navigation.goBack()}
        rightAction={
          <Button title="👁️ Preview" size="sm" variant="primary" onPress={handlePreview} />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" style={styles.sampleCard}>
          <Text style={[styles.sampleTitle, { color: theme.colors.text }]}>
            ⚡ 1-Tap Load Sample Cover Letter:
          </Text>
          <Button
            title="📝 Load Tech Role Cover Letter"
            size="sm"
            variant="outline"
            onPress={handleLoadSample}
          />
        </Card>

        {/* Sender Details */}
        <Section title="1. Your Information (Sender)">
          <Input
            label="Your Full Name *"
            value={letter.sender.name}
            onChangeText={(t) => setLetter({ ...letter, sender: { ...letter.sender, name: t } })}
            placeholder="e.g. Kartikey Srivastava"
          />
          <Input
            label="Your Professional Title"
            value={letter.sender.title}
            onChangeText={(t) => setLetter({ ...letter, sender: { ...letter.sender, title: t } })}
            placeholder="e.g. Senior Software Engineer"
          />
          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Input
                label="Email"
                value={letter.sender.email}
                onChangeText={(t) => setLetter({ ...letter, sender: { ...letter.sender, email: t } })}
                placeholder="email@example.com"
              />
            </View>
            <View style={styles.halfCol}>
              <Input
                label="Phone"
                value={letter.sender.phone}
                onChangeText={(t) => setLetter({ ...letter, sender: { ...letter.sender, phone: t } })}
                placeholder="+91 98765 XXXXX"
              />
            </View>
          </View>
          <Input
            label="Location (City, Country)"
            value={letter.sender.location}
            onChangeText={(t) => setLetter({ ...letter, sender: { ...letter.sender, location: t } })}
            placeholder="Bangalore, India"
          />
        </Section>

        {/* Recipient Details */}
        <Section title="2. Employer / Company (Recipient)">
          <Input
            label="Hiring Manager / Team"
            value={letter.recipient.hiringManager}
            onChangeText={(t) => setLetter({ ...letter, recipient: { ...letter.recipient, hiringManager: t } })}
            placeholder="Hiring Team / Mr. Sharma"
          />
          <Input
            label="Company Name"
            value={letter.recipient.company}
            onChangeText={(t) => setLetter({ ...letter, recipient: { ...letter.recipient, company: t } })}
            placeholder="Google India / Infosys"
          />
          <Input
            label="Target Position / Role"
            value={letter.targetRole}
            onChangeText={(t) => setLetter({ ...letter, targetRole: t })}
            placeholder="e.g. Lead Mobile Engineer"
          />
          <Input
            label="Company Location"
            value={letter.recipient.location}
            onChangeText={(t) => setLetter({ ...letter, recipient: { ...letter.recipient, location: t } })}
            placeholder="Bangalore, India"
          />
        </Section>

        {/* Letter Content */}
        <Section title="3. Letter Content & Body">
          <Input
            label="Opening Hook / Paragraph"
            value={letter.openingParagraph}
            onChangeText={(t) => setLetter({ ...letter, openingParagraph: t })}
            placeholder="I am writing to express my strong interest in the [Role] at [Company]..."
            multiline
            numberOfLines={4}
          />
          <Input
            label="Core Achievements / Middle Paragraph"
            value={letter.bodyParagraph}
            onChangeText={(t) => setLetter({ ...letter, bodyParagraph: t })}
            placeholder="In my previous position, I successfully delivered key outcomes..."
            multiline
            numberOfLines={5}
          />
          <Input
            label="Closing Call-to-Action"
            value={letter.closingParagraph}
            onChangeText={(t) => setLetter({ ...letter, closingParagraph: t })}
            placeholder="I would love the opportunity to discuss how my skill set can benefit your goals..."
            multiline
            numberOfLines={3}
          />
        </Section>

        <ColorPalettePicker
          selectedColor={letter.accentColor}
          onSelectColor={(c) => setLetter({ ...letter, accentColor: c })}
        />

        <View style={styles.bottomBar}>
          <View style={styles.btn}>
            <Button title="💾 Save Draft" variant="secondary" onPress={handleSave} />
          </View>
          <View style={styles.btn}>
            <Button title="👁️ Preview & Export" variant="primary" onPress={handlePreview} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  sampleCard: {
    margin: 16,
    padding: 14,
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  btn: {
    flex: 1,
  },
});
