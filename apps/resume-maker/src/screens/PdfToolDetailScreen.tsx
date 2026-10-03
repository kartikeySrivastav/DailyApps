/**
 * PdfToolDetailScreen — Screens 40–49: Unified PDF tool detail
 *
 * Each tool (merge, split, compress, pdf_to_image, image_to_pdf, rotate,
 * delete_pages, reorder, viewer, scan) gets a dedicated UI section inside
 * this single screen component. This avoids 10 separate boilerplate screen
 * files while giving each tool its reference-accurate layout.
 */
import React, { useState } from 'react';
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

interface Props {
  navigation: any;
  route: any;
}

/* ────── Shared Sub-components ────── */

const FileCard: React.FC<{ name: string; meta: string; index?: number }> = ({ name, meta, index }) => (
  <View style={s.fileCard}>
    {index != null && (
      <View style={s.fileIndex}><Text style={s.fileIndexText}>{index}</Text></View>
    )}
    <View style={s.pdfBadge}><Text style={s.pdfBadgeText}>PDF</Text></View>
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={s.fileName} numberOfLines={1}>{name}</Text>
      <Text style={s.fileMeta}>{meta}</Text>
    </View>
    <TouchableOpacity style={s.fileMenu}><Text style={s.fileMenuText}>⋮</Text></TouchableOpacity>
  </View>
);

const PageThumb: React.FC<{ page: number; selected?: boolean; onToggle?: () => void }> = ({ page, selected, onToggle }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onToggle}
    style={[s.pageThumb, selected && s.pageThumbSelected]}
  >
    <View style={s.pageThumbInner}>
      <View style={s.pageLine} /><View style={s.pageLine} /><View style={[s.pageLine, { width: '60%' }]} />
    </View>
    {selected && (
      <View style={s.pageCheck}><Text style={s.pageCheckText}>✓</Text></View>
    )}
    <Text style={[s.pageNum, selected && s.pageNumSelected]}>{page}</Text>
  </TouchableOpacity>
);

const GradientCTA: React.FC<{ label: string; icon?: string; onPress: () => void }> = ({ label, icon, onPress }) => (
  <View style={s.ctaWrap}>
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={s.ctaBtn}>
      <Text style={s.ctaText}>{icon ? `${icon}  ` : ''}{label}</Text>
    </TouchableOpacity>
  </View>
);

/* ────── Tool-specific content renderers ────── */

const MergeContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  return (
    <>
      <Text style={s.heading}>Merge PDF Files</Text>
      <Text style={s.sub}>Drag files to set their order</Text>
      <FileCard name="My_Resume.pdf" meta="2.4 MB" index={1} />
      <FileCard name="My_Biodata.pdf" meta="1.8 MB" index={2} />
      <FileCard name="Portfolio.pdf" meta="3.1 MB" index={3} />
      <TouchableOpacity style={s.addBtn}><Text style={s.addBtnText}>+ Add Files</Text></TouchableOpacity>
      <View style={s.infoRow}><Text style={s.infoIcon}>ℹ️</Text><Text style={s.infoText}>The files will be combined in the order shown above.</Text></View>
      <GradientCTA label="Merge PDF" icon="🔗" onPress={onAction} />
    </>
  );
};

const SplitContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [mode, setMode] = useState<'all' | 'selected' | 'range'>('range');
  return (
    <>
      <Text style={s.heading}>Split PDF</Text>
      <Text style={s.sub}>3 files selected</Text>
      <FileCard name="My_Document.pdf" meta="4.2 MB  •  8 Pages" />
      <Text style={s.sectionTitle}>Split Options</Text>
      {(['all', 'selected', 'range'] as const).map((m) => (
        <TouchableOpacity key={m} onPress={() => setMode(m)} style={s.radioRow}>
          <View style={[s.radio, mode === m && s.radioActive]}>
            {mode === m && <View style={s.radioInner} />}
          </View>
          <Text style={s.radioLabel}>
            {m === 'all' ? 'Split all pages' : m === 'selected' ? 'Selected pages' : 'Page range'}
          </Text>
        </TouchableOpacity>
      ))}
      {mode === 'range' && (
        <View style={s.rangeRow}>
          <View style={s.rangeField}><Text style={s.rangeLabel}>From</Text><View style={s.rangeInput}><Text style={s.rangeValue}>1</Text><Text style={s.chevron}>⌄</Text></View></View>
          <View style={s.rangeField}><Text style={s.rangeLabel}>To</Text><View style={s.rangeInput}><Text style={s.rangeValue}>5</Text><Text style={s.chevron}>⌄</Text></View></View>
        </View>
      )}
      <Text style={s.sectionTitle}>Page Preview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3, 4, 5].map((p) => <PageThumb key={p} page={p} selected={p <= 3} />)}
        </View>
      </ScrollView>
      <GradientCTA label="Split PDF" icon="✂️" onPress={onAction} />
    </>
  );
};

const CompressContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const levels = [
    { key: 'low' as const, icon: '🟢', label: 'Low', sub: 'Best Quality' },
    { key: 'medium' as const, icon: '📦', label: 'Medium', sub: 'Balanced' },
    { key: 'high' as const, icon: '⚡', label: 'High', sub: 'Smallest Size' },
  ];
  return (
    <>
      <Text style={s.heading}>Reduce PDF Size</Text>
      <FileCard name="My_Resume.pdf" meta="2.4 MB" />
      <Text style={s.sectionTitle}>Compression Level</Text>
      <View style={s.levelRow}>
        {levels.map((l) => (
          <TouchableOpacity key={l.key} onPress={() => setLevel(l.key)} style={[s.levelCard, level === l.key && s.levelCardActive]}>
            <Text style={s.levelIcon}>{l.icon}</Text>
            <Text style={[s.levelLabel, level === l.key && s.levelLabelActive]}>{l.label}</Text>
            <Text style={s.levelSub}>{l.sub}</Text>
            {level === l.key && <View style={s.levelCheck}><Text style={s.levelCheckText}>✓</Text></View>}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.sectionTitle}>Estimated Result</Text>
      <View style={s.estimateRow}>
        <View style={s.estimateCol}><Text style={s.estimateLabel}>Original</Text><Text style={s.estimateValue}>2.4 MB</Text></View>
        <Text style={s.estimateArrow}>→</Text>
        <View style={s.estimateCol}><Text style={s.estimateLabel}>Estimated</Text><Text style={[s.estimateValue, { color: '#10B981' }]}>1.3 MB</Text></View>
      </View>
      <View style={s.progressBarBg}><View style={[s.progressBarFill, { width: '54%' }]} /></View>
      <View style={s.progressLabels}><Text style={s.progressLabel}>2.4 MB</Text><Text style={s.progressLabel}>1.3 MB</Text></View>
      <View style={s.infoRow}><Text style={s.infoIcon}>⚠️</Text><Text style={s.infoText}>Higher compression may slightly reduce image quality.</Text></View>
      <GradientCTA label="Compress PDF" icon="🗜️" onPress={onAction} />
    </>
  );
};

const ImageToPdfContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  return (
    <>
      <Text style={s.heading}>Create PDF from Images</Text>
      <Text style={s.sub}>Select and arrange your images</Text>
      <View style={s.imageGrid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={s.imageThumb}>
            <View style={s.imageThumbIndex}><Text style={s.imageThumbIndexText}>{i}</Text></View>
            <View style={s.imageThumbRemove}><Text style={s.imageThumbRemoveText}>×</Text></View>
            <View style={s.imagePlaceholder}><Text style={{ fontSize: 24, color: '#94A3B8' }}>🏞️</Text></View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={s.addBtn}><Text style={s.addBtnText}>+ Add Images</Text></TouchableOpacity>
      <Text style={s.sectionTitle}>Page Size</Text>
      <View style={s.dropdownBtn}><Text style={s.dropdownText}>A4</Text><Text style={s.chevron}>⌄</Text></View>
      <Text style={s.sectionTitle}>Orientation</Text>
      <View style={s.toggleRow}>
        <TouchableOpacity onPress={() => setOrientation('portrait')} style={[s.toggleBtn, orientation === 'portrait' && s.toggleBtnActive]}>
          <Text style={[s.toggleText, orientation === 'portrait' && s.toggleTextActive]}>Portrait</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrientation('landscape')} style={[s.toggleBtn, orientation === 'landscape' && s.toggleBtnActive]}>
          <Text style={[s.toggleText, orientation === 'landscape' && s.toggleTextActive]}>Landscape</Text>
        </TouchableOpacity>
      </View>
      <View style={s.fitRow}><Text style={s.fitLabel}>Fit to Page</Text><View style={[s.toggleSwitch, { backgroundColor: '#2563EB' }]}><View style={[s.toggleKnob, { left: 22 }]} /></View></View>
      <View style={s.infoRow}><Text style={s.infoIcon}>📷</Text><Text style={s.infoText}>4 images selected</Text></View>
      <GradientCTA label="Create PDF" icon="📄" onPress={onAction} />
    </>
  );
};

const PdfToImageContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  return (
    <>
      <Text style={s.heading}>Convert PDF to Images</Text>
      <Text style={s.sub}>Save PDF pages as image files</Text>
      <FileCard name="My_Resume.pdf" meta="2.4 MB  •  2 Pages" />
      <Text style={s.sectionTitle}>Output Format</Text>
      <View style={s.toggleRow}>
        <TouchableOpacity onPress={() => setFormat('jpg')} style={[s.toggleBtnWide, format === 'jpg' && s.toggleBtnActive]}>
          <Text style={s.formatIcon}>📸</Text><Text style={[s.toggleText, format === 'jpg' && s.toggleTextActive]}>JPG</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFormat('png')} style={[s.toggleBtnWide, format === 'png' && s.toggleBtnActive]}>
          <Text style={s.formatIcon}>🖼️</Text><Text style={[s.toggleText, format === 'png' && s.toggleTextActive]}>PNG</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.sectionTitle}>Pages</Text>
      <View style={s.radioRow}><View style={[s.radio, s.radioActive]}><View style={s.radioInner} /></View><Text style={s.radioLabel}>All Pages</Text></View>
      <View style={s.radioRow}><View style={s.radio} /><Text style={s.radioLabel}>Selected Pages</Text></View>
      <Text style={s.sectionTitle}>Image Quality</Text>
      <View style={s.levelRow}>
        {(['low', 'medium', 'high'] as const).map((q) => (
          <TouchableOpacity key={q} onPress={() => setQuality(q)} style={[s.qualityBtn, quality === q && s.qualityBtnActive]}>
            <Text style={[s.qualityText, quality === q && s.qualityTextActive]}>{q.charAt(0).toUpperCase() + q.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.infoRow}><Text style={s.infoIcon}>ℹ️</Text><Text style={s.infoText}>2 images will be created</Text></View>
      <GradientCTA label="Convert to Images" icon="🖼️" onPress={onAction} />
    </>
  );
};

const RotateContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [selectedPages, setSelectedPages] = useState<number[]>([1, 4]);
  const [angle, setAngle] = useState<90 | -90 | 180>(90);
  const togglePage = (p: number) => setSelectedPages((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  return (
    <>
      <Text style={s.heading}>Rotate PDF Pages</Text>
      <Text style={s.sub}>Select pages and choose rotation</Text>
      <FileCard name="My_Document.pdf" meta="8 Pages" />
      <Text style={s.sectionTitle}>Select Pages</Text>
      <View style={s.pageGrid}>{[1, 2, 3, 4, 5, 6, 7, 8].map((p) => <PageThumb key={p} page={p} selected={selectedPages.includes(p)} onToggle={() => togglePage(p)} />)}</View>
      <Text style={s.sectionTitle}>Rotation Angle</Text>
      <View style={s.angleRow}>
        {([{ v: -90 as const, l: '90° Left', icon: '↩️' }, { v: 90 as const, l: '90° Right', icon: '↪️' }, { v: 180 as const, l: '180°', icon: '🔄' }]).map((a) => (
          <TouchableOpacity key={a.v} onPress={() => setAngle(a.v)} style={[s.angleCard, angle === a.v && s.angleCardActive]}>
            <Text style={s.angleIcon}>{a.icon}</Text>
            <Text style={[s.angleLabel, angle === a.v && s.angleLabelActive]}>{a.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.infoRow}><Text style={s.infoIcon}>ℹ️</Text><Text style={s.infoText}>{selectedPages.length} pages selected</Text></View>
      <GradientCTA label="Rotate & Save" icon="🔄" onPress={onAction} />
    </>
  );
};

const DeletePagesContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [selectedPages, setSelectedPages] = useState<number[]>([2, 3]);
  const togglePage = (p: number) => setSelectedPages((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  return (
    <>
      <Text style={s.heading}>Remove Pages</Text>
      <Text style={s.sub}>Select pages you want to delete</Text>
      <FileCard name="My_Document.pdf" meta="8 Pages" />
      <Text style={s.sectionTitle}>Select Pages</Text>
      <View style={s.pageGrid}>{[1, 2, 3, 4, 5, 6, 7, 8].map((p) => <PageThumb key={p} page={p} selected={selectedPages.includes(p)} onToggle={() => togglePage(p)} />)}</View>
      <View style={s.infoRow}><Text style={s.infoIcon}>🗑️</Text><Text style={s.infoText}>{selectedPages.length} pages selected</Text></View>
      <View style={[s.infoRow, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
        <Text style={s.infoIcon}>⚠️</Text><Text style={[s.infoText, { color: '#DC2626' }]}>Deleted pages cannot be restored.</Text>
      </View>
      <GradientCTA label="Delete Pages" icon="🗑️" onPress={onAction} />
    </>
  );
};

const ReorderContent: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <>
    <Text style={s.heading}>Arrange PDF Pages</Text>
    <Text style={s.sub}>Drag pages to change their order</Text>
    <FileCard name="My_Document.pdf" meta="8 Pages" />
    <Text style={s.sectionTitle}>Select Pages</Text>
    <View style={s.pageGrid}>{[1, 3, 2, 4, 5, 6, 7, 8].map((p, i) => <PageThumb key={i} page={p} />)}</View>
    <View style={s.infoRow}><Text style={s.infoIcon}>ℹ️</Text><Text style={s.infoText}>Press and drag a page to move.</Text></View>
    <GradientCTA label="Save Order" icon="💾" onPress={onAction} />
  </>
);

const ViewerContent: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <>
    <Text style={s.heading}>PDF Viewer</Text>
    <Text style={s.sub}>View and read your PDF documents</Text>
    <TouchableOpacity style={s.addBtn} onPress={onAction}><Text style={s.addBtnText}>📂  Browse Files</Text></TouchableOpacity>
    <View style={s.infoRow}><Text style={s.infoIcon}>ℹ️</Text><Text style={s.infoText}>Select a PDF file to open the viewer.</Text></View>
  </>
);

const ScanContent: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <>
    <Text style={s.heading}>Scan Document</Text>
    <Text style={s.sub}>Point your camera at a document to scan</Text>
    {/* Camera placeholder */}
    <View style={s.cameraPlaceholder}>
      <View style={s.scanFrame}>
        <Text style={{ fontSize: 40 }}>📷</Text>
        <Text style={s.scanText}>Camera Preview</Text>
      </View>
    </View>
    <View style={s.scanActions}>
      <TouchableOpacity style={s.scanActionBtn}><Text style={s.scanActionIcon}>🖼️</Text><Text style={s.scanActionLabel}>Gallery</Text></TouchableOpacity>
      <TouchableOpacity style={s.scanActionBtn}><Text style={s.scanActionIcon}>📷</Text><Text style={s.scanActionLabel}>Add Page</Text></TouchableOpacity>
    </View>
    <View style={s.fitRow}><Text style={s.fitLabel}>✅ Auto Crop</Text><View style={[s.toggleSwitch, { backgroundColor: '#2563EB' }]}><View style={[s.toggleKnob, { left: 22 }]} /></View></View>
    <GradientCTA label="Create PDF" icon="📄" onPress={onAction} />
  </>
);

const SelectFilesContent: React.FC<{ onAction: () => void }> = ({ onAction }) => {
  const [tab, setTab] = useState<'recent' | 'pdf' | 'images'>('recent');
  const [selected, setSelected] = useState<number[]>([0, 1]);
  const files = [
    { name: 'My_Resume.pdf', meta: 'PDF  •  2.4 MB' },
    { name: 'My_Biodata.pdf', meta: 'PDF  •  1.8 MB' },
    { name: 'Portfolio.pdf', meta: 'PDF  •  3.1 MB' },
    { name: 'Document.pdf', meta: 'PDF  •  4.2 MB' },
  ];
  const toggle = (i: number) => setSelected((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  return (
    <>
      <Text style={s.heading}>Select Files</Text>
      <Text style={s.sub}>Choose files to continue</Text>
      <View style={s.tabRow}>
        {(['recent', 'pdf', 'images'] as const).map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[s.tabBtn, tab === t && s.tabBtnActive]}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {files.map((f, i) => (
        <TouchableOpacity key={i} onPress={() => toggle(i)} style={s.selectFileRow}>
          <View style={[s.checkbox, selected.includes(i) && s.checkboxActive]}>
            {selected.includes(i) && <Text style={s.checkboxText}>✓</Text>}
          </View>
          <View style={s.pdfBadge}><Text style={s.pdfBadgeText}>PDF</Text></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={s.fileName}>{f.name}</Text>
            <Text style={s.fileMeta}>{f.meta}</Text>
          </View>
          <TouchableOpacity style={s.fileMenu}><Text style={s.fileMenuText}>⋮</Text></TouchableOpacity>
        </TouchableOpacity>
      ))}
      <View style={s.infoRow}><Text style={s.infoIcon}>✅</Text><Text style={s.infoText}>{selected.length} files selected</Text></View>
      <View style={s.dualBtnRow}>
        <TouchableOpacity style={s.outlineBtn}><Text style={s.outlineBtnText}>Browse Files</Text></TouchableOpacity>
        <TouchableOpacity style={s.primaryBtn} onPress={onAction}><Text style={s.primaryBtnText}>Continue  →</Text></TouchableOpacity>
      </View>
    </>
  );
};

/* ────── Main Screen ────── */

export const PdfToolDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const toolId: string = route.params?.toolId || 'merge';
  const title: string = route.params?.title || 'PDF Tool';

  const handleAction = () => {
    navigation.navigate('PdfProcessing', { toolId, title });
  };

  const handleNavigation = (dest: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: dest });
  };

  const renderContent = () => {
    switch (toolId) {
      case 'merge': return <MergeContent onAction={handleAction} />;
      case 'split': return <SplitContent onAction={handleAction} />;
      case 'compress': return <CompressContent onAction={handleAction} />;
      case 'image_to_pdf': return <ImageToPdfContent onAction={handleAction} />;
      case 'pdf_to_image': return <PdfToImageContent onAction={handleAction} />;
      case 'rotate': return <RotateContent onAction={handleAction} />;
      case 'delete_pages': return <DeletePagesContent onAction={handleAction} />;
      case 'reorder': return <ReorderContent onAction={handleAction} />;
      case 'viewer': return <ViewerContent onAction={handleAction} />;
      case 'scan': return <ScanContent onAction={handleAction} />;
      default: return <SelectFilesContent onAction={handleAction} />;
    }
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
      <ResumeBottomNav active="tools" onNavigate={handleNavigation} />
    </ScreenContainer>
  );
};

/* ────── Styles ────── */

const s = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 140 },

  // Headings
  heading: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 6 },
  sub: { fontSize: 14, color: '#64748B', marginBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginTop: 18, marginBottom: 10 },

  // File card
  fileCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', marginBottom: 10 },
  fileIndex: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fileIndexText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  pdfBadge: { width: 36, height: 40, borderRadius: 6, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  pdfBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  fileName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  fileMeta: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  fileMenu: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  fileMenuText: { fontSize: 18, color: '#94A3B8' },

  // Add button
  addBtn: { paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C7D5EC', alignItems: 'center', marginBottom: 16 },
  addBtnText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },

  // Info row
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  infoIcon: { fontSize: 14 },
  infoText: { fontSize: 12, color: '#64748B', flex: 1 },

  // CTA
  ctaWrap: { marginTop: 8, marginBottom: 20 },
  ctaBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', backgroundColor: '#2563EB', elevation: 6, shadowColor: '#2563EB', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10 },
  ctaText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // Radio
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#2563EB' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' },
  radioLabel: { fontSize: 14, color: '#1E293B' },

  // Range
  rangeRow: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12 },
  rangeField: { flex: 1 },
  rangeLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6 },
  rangeInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#D6E2F7', backgroundColor: '#FFF' },
  rangeValue: { fontSize: 15, color: '#1E293B', fontWeight: '600' },
  chevron: { fontSize: 18, color: '#94A3B8' },

  // Page thumbnails
  pageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  pageThumb: { width: '22%', aspectRatio: 0.75, borderRadius: 8, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', padding: 6, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  pageThumbSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  pageThumbInner: { width: '100%', gap: 4 },
  pageLine: { height: 3, backgroundColor: '#E2E8F0', borderRadius: 2, width: '80%' },
  pageCheck: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  pageCheckText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  pageNum: { fontSize: 11, color: '#94A3B8', fontWeight: '700', marginTop: 4 },
  pageNumSelected: { color: '#2563EB' },

  // Compression levels
  levelRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  levelCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFF', alignItems: 'center', position: 'relative' },
  levelCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  levelIcon: { fontSize: 20, marginBottom: 6 },
  levelLabel: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  levelLabelActive: { color: '#2563EB' },
  levelSub: { fontSize: 10, color: '#94A3B8' },
  levelCheck: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  levelCheckText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  // Estimate
  estimateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 },
  estimateCol: { alignItems: 'center' },
  estimateLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  estimateValue: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  estimateArrow: { fontSize: 18, color: '#94A3B8' },
  progressBarBg: { height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', marginBottom: 4 },
  progressBarFill: { height: 8, borderRadius: 4, backgroundColor: '#2563EB' },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  progressLabel: { fontSize: 11, color: '#94A3B8' },

  // Image grid
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  imageThumb: { width: '47%', aspectRatio: 1.3, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  imageThumbIndex: { position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  imageThumbIndexText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  imageThumbRemove: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  imageThumbRemoveText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  imagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },

  // Toggle buttons
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#FFF' },
  toggleBtnWide: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  toggleBtnActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  toggleText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  toggleTextActive: { color: '#2563EB' },
  formatIcon: { fontSize: 16 },

  // Fit / switch
  fitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingVertical: 8 },
  fitLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  toggleSwitch: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center', position: 'relative' },
  toggleKnob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFF', position: 'absolute', top: 3 },

  // Angle cards
  angleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  angleCard: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFF', alignItems: 'center' },
  angleCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  angleIcon: { fontSize: 20, marginBottom: 6 },
  angleLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  angleLabelActive: { color: '#2563EB' },

  // Quality pills
  qualityBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', backgroundColor: '#FFF' },
  qualityBtnActive: { borderColor: '#2563EB', backgroundColor: '#2563EB' },
  qualityText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  qualityTextActive: { color: '#FFF' },

  // Camera / Scan
  cameraPlaceholder: { height: 280, borderRadius: 16, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  scanFrame: { width: 200, height: 260, borderWidth: 2, borderColor: '#2563EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scanText: { color: '#94A3B8', fontSize: 13, marginTop: 8 },
  scanActions: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 16 },
  scanActionBtn: { alignItems: 'center', gap: 4 },
  scanActionIcon: { fontSize: 24 },
  scanActionLabel: { fontSize: 12, fontWeight: '700', color: '#1E293B' },

  // Dropdown
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13, borderRadius: 10, borderWidth: 1, borderColor: '#D6E2F7', backgroundColor: '#FFF', marginBottom: 16 },
  dropdownText: { fontSize: 15, color: '#1E293B' },

  // Select files
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabBtn: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  tabBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFF' },
  selectFileRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkboxText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  dualBtnRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  outlineBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#2563EB', alignItems: 'center' },
  outlineBtnText: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  primaryBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
