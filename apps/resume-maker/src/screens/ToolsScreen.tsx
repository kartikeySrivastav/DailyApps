import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

/**
 * ToolsScreen — Screen 39: PDF Tools
 *
 * Reference: "PDF Tools" header + subtitle, 2-column grid with icon+label cards:
 * Merge PDF, Split PDF, Compress PDF, PDF to Image, Image to PDF, Rotate PDF,
 * Delete Pages, Reorder Pages, PDF Viewer, Scan to PDF.
 */

interface Props {
  navigation: any;
}

interface ToolItem {
  id: string;
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  bg: string;
  screen: string;
}

const TOOLS: ToolItem[] = [
  { id: 'merge', icon: '📎', label: 'Merge PDF', subtitle: 'Combine multiple PDFs', color: '#2563EB', bg: '#EFF6FF', screen: 'PdfMerge' },
  { id: 'split', icon: '✂️', label: 'Split PDF', subtitle: 'Separate pages from a PDF', color: '#7C3AED', bg: '#F5F3FF', screen: 'PdfSplit' },
  { id: 'compress', icon: '🗜️', label: 'Compress PDF', subtitle: 'Reduce PDF file size', color: '#059669', bg: '#ECFDF5', screen: 'PdfCompress' },
  { id: 'pdf_to_image', icon: '🖼️', label: 'PDF to Image', subtitle: 'Convert PDF pages to images', color: '#0284C7', bg: '#E0F2FE', screen: 'PdfToImage' },
  { id: 'image_to_pdf', icon: '📷', label: 'Image to PDF', subtitle: 'Create PDF from images', color: '#E11D48', bg: '#FFF1F2', screen: 'ImageToPdf' },
  { id: 'rotate', icon: '🔄', label: 'Rotate PDF', subtitle: 'Rotate PDF pages', color: '#0D9488', bg: '#F0FDFA', screen: 'PdfRotate' },
  { id: 'delete_pages', icon: '🗑️', label: 'Delete Pages', subtitle: 'Remove selected PDF pages', color: '#DC2626', bg: '#FEF2F2', screen: 'PdfDeletePages' },
  { id: 'reorder', icon: '↕️', label: 'Reorder Pages', subtitle: 'Change page order', color: '#D97706', bg: '#FFFBEB', screen: 'PdfReorder' },
  { id: 'viewer', icon: '👁️', label: 'PDF Viewer', subtitle: 'View your PDF files', color: '#4F46E5', bg: '#EEF2FF', screen: 'PdfViewer' },
  { id: 'scan', icon: '📱', label: 'Scan to PDF', subtitle: 'Scan documents using camera', color: '#9333EA', bg: '#FAF5FF', screen: 'PdfScan' },
];

export const ToolsScreen: React.FC<Props> = ({ navigation }) => {
  const handleTool = (tool: ToolItem) => {
    navigation.navigate('PdfToolDetail', { toolId: tool.id, title: tool.label });
  };

  const handleNavigation = (dest: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: dest });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader
        title="PDF Tools"
        subtitle="Everything you need to manage your PDF files"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2-Column Grid */}
        <View style={styles.toolsGrid}>
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              activeOpacity={0.8}
              onPress={() => handleTool(tool)}
              style={styles.toolCard}
            >
              <View style={[styles.toolIconBox, { backgroundColor: tool.bg }]}>
                <Text style={styles.toolIcon}>{tool.icon}</Text>
              </View>
              <Text style={styles.toolLabel} numberOfLines={1}>{tool.label}</Text>
              <Text style={styles.toolSub} numberOfLines={2}>{tool.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ResumeBottomNav active="tools" onNavigate={handleNavigation} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '47%',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  toolIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  toolSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});
