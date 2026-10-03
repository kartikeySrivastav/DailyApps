import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Share,
} from 'react-native';
import { ScreenContainer } from '@dailyapps/ui';
import { useAppStorage } from '@dailyapps/storage';
import { AnyDocumentProfile } from '../types/resume.types';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResumeBottomNav } from '../components/ResumeBottomNav';

interface Props {
  navigation: any;
  route?: any;
}

type FilterType = 'all' | 'resume' | 'biodata' | 'pdf';
type SortType = 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc' | 'type';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'resume', label: 'Resume' },
  { key: 'biodata', label: 'Biodata' },
  { key: 'pdf', label: 'PDF' },
];

const SORT_OPTIONS: { key: SortType; label: string; icon: string }[] = [
  { key: 'date_desc', label: 'Newest First', icon: '📅' },
  { key: 'date_asc', label: 'Oldest First', icon: '📆' },
  { key: 'name_asc', label: 'Name A → Z', icon: '🔤' },
  { key: 'name_desc', label: 'Name Z → A', icon: '🔡' },
  { key: 'type', label: 'By Type', icon: '📋' },
];

export const MasterProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const storage = useAppStorage();

  const [documents, setDocuments] = useState<AnyDocumentProfile[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('date_desc');
  const [deleteTarget, setDeleteTarget] = useState<AnyDocumentProfile | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState<AnyDocumentProfile | null>(null);

  const loadData = async () => {
    try {
      const docs = await storage.getJson<AnyDocumentProfile[]>('saved_documents', []);
      setDocuments(docs);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const updatedDocument = route?.params?.renamedDocument || route?.params?.duplicatedDocument;
    if (!updatedDocument) return;
    setDocuments((current) => {
      const next = route.params.renamedDocument
        ? current.map((item) => item.id === updatedDocument.id ? updatedDocument : item)
        : [updatedDocument, ...current.filter((item) => item.id !== updatedDocument.id)];
      storage.setJson('saved_documents', next);
      return next;
    });
    navigation.setParams({ renamedDocument: undefined, duplicatedDocument: undefined });
  }, [route?.params?.renamedDocument, route?.params?.duplicatedDocument, navigation, storage]);

  const filteredDocs = useMemo(() => {
    let result = documents.filter((doc) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'biodata') return doc.type === 'marriage_biodata';
      if (activeFilter === 'pdf') return true; // All docs are PDFs
      return doc.type === activeFilter;
    });

    // Apply sorting
    result = [...result].sort((a, b) => {
      const nameA = getDocName(a).toLowerCase();
      const nameB = getDocName(b).toLowerCase();
      const dateA = (a as any).updatedAt || 0;
      const dateB = (b as any).updatedAt || 0;
      switch (activeSort) {
        case 'date_desc': return dateB - dateA;
        case 'date_asc': return dateA - dateB;
        case 'name_asc': return nameA.localeCompare(nameB);
        case 'name_desc': return nameB.localeCompare(nameA);
        case 'type': return a.type.localeCompare(b.type);
        default: return 0;
      }
    });

    return result;
  }, [documents, activeFilter, activeSort]);

  const handleOpenDoc = (doc: AnyDocumentProfile) => {
    navigation.navigate('LivePreview', { document: doc });
  };

  const handleEditDoc = (doc: AnyDocumentProfile) => {
    if (doc.type === 'marriage_biodata') {
      navigation.navigate('MarriageBiodataBuilder', { document: doc });
    } else if (doc.type === 'cover_letter') {
      navigation.navigate('CoverLetterBuilder', { document: doc });
    } else {
      navigation.navigate('ResumeBuilder', { document: doc });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const filtered = documents.filter((d) => d.id !== deleteTarget.id);
    setDocuments(filtered);
    await storage.setJson('saved_documents', filtered);
    setDeleteTarget(null);
  };

  const handleNavigation = (dest: 'home' | 'documents' | 'templates' | 'tools' | 'settings') => {
    navigation.navigate('MainTabs', { initialTab: dest });
  };

  const handleLongPress = (doc: AnyDocumentProfile) => {
    setContextMenuTarget(doc);
  };

  const handleContextAction = (action: string) => {
    if (!contextMenuTarget) return;
    const doc = contextMenuTarget;
    setContextMenuTarget(null);
    switch (action) {
      case 'open':
        handleOpenDoc(doc);
        break;
      case 'edit':
        handleEditDoc(doc);
        break;
      case 'rename':
        navigation.navigate('DocumentAction', { mode: 'rename', document: doc });
        break;
      case 'duplicate':
        navigation.navigate('DocumentAction', { mode: 'duplicate', document: doc });
        break;
      case 'share':
        Share.share({ title: getDocName(doc), message: `Sharing document: ${getDocName(doc)}` }).catch(() => {});
        break;
      case 'delete':
        setDeleteTarget(doc);
        break;
    }
  };

  const handleExportDoc = (doc: AnyDocumentProfile) => {
    navigation.navigate('ExportPdf', { document: doc });
  };

  const getDocIcon = (doc: AnyDocumentProfile): { icon: string; bg: string; color: string } => {
    if (doc.type === 'marriage_biodata') return { icon: '💍', bg: '#FDF4FF', color: '#9333EA' };
    if (doc.type === 'cover_letter') return { icon: '✉️', bg: '#FFF7ED', color: '#EA580C' };
    return { icon: '📄', bg: '#EFF6FF', color: '#2563EB' };
  };

  const getDocLabel = (doc: AnyDocumentProfile): string => {
    if (doc.type === 'marriage_biodata') return 'Biodata';
    if (doc.type === 'cover_letter') return 'Cover Letter';
    return 'Resume';
  };

  const getDocName = (doc: AnyDocumentProfile): string => {
    return (doc as any).title ||
      (doc as any).personalInfo?.fullName ||
      'My Document';
  };

  const getUpdatedDate = (doc: AnyDocumentProfile): string => {
    const ts = (doc as any).updatedAt || Date.now();
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <ScreenContainer scrollable={false} withPadding={false}>
      {/* Screen 33: Header with search + filter icons */}
      <ScreenHeader
        title="My Documents"
        onBack={() => navigation.goBack()}
        rightElement={
          <View style={styles.headerRight}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('FinalSupportFlow', { mode: 'search' })}
              style={styles.iconBtn}
            >
              <Text style={styles.iconBtnText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowSortModal(true)}
              style={styles.iconBtn}
            >
              <Text style={styles.iconBtnText}>⚙</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Tabs — reference-style pill tabs */}
      <View style={styles.filterTabsRow}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(f.key)}
              style={[
                styles.filterTab,
                isActive && styles.filterTabActive,
              ]}
            >
              <Text style={[styles.filterTabLabel, isActive && styles.filterTabLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Document List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredDocs.length === 0 ? (
          /* Screen 38: Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <Text style={styles.emptyIllustrationIcon}>📁</Text>
              <View style={styles.emptyPlusBadge}>
                <Text style={styles.emptyPlusText}>+</Text>
              </View>
            </View>
            <Text style={styles.emptyTitle}>No documents yet</Text>
            <Text style={styles.emptySub}>
              Create your first resume or biodata{"\n"}to get started.
            </Text>

            {/* Dual CTAs matching reference */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('DocumentTypeSelector', { initialType: 'resume' })}
              style={styles.emptyPrimaryBtn}
            >
              <Text style={styles.emptyPrimaryText}>📄  Create Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('BiodataTypeSelector')}
              style={styles.emptyOutlineBtn}
            >
              <Text style={styles.emptyOutlineText}>💍  Create Biodata</Text>
            </TouchableOpacity>

            <View style={styles.emptyInfoRow}>
              <Text style={styles.emptyInfoIcon}>ℹ️</Text>
              <Text style={styles.emptyInfoText}>
                Your documents will appear here after you create them.
              </Text>
            </View>
          </View>
        ) : (
          /* Screen 33: Document cards */
          <View style={styles.listContainer}>
            {filteredDocs.map((doc) => {
              const iconInfo = getDocIcon(doc);
              return (
                <TouchableOpacity
                  key={doc.id}
                  activeOpacity={0.9}
                  onLongPress={() => handleLongPress(doc)}
                  delayLongPress={400}
                  style={styles.docCard}
                >
                  {/* Top row: Icon + Info + Three-dot */}
                  <View style={styles.docCardTop}>
                    <View style={[styles.docIconBox, { backgroundColor: iconInfo.bg }]}>
                      <Text style={styles.docIconText}>{iconInfo.icon}</Text>
                    </View>
                    <View style={styles.docInfo}>
                      <Text style={styles.docName} numberOfLines={1}>{getDocName(doc)}</Text>
                      <Text style={[styles.docMeta, { color: iconInfo.color }]}>
                        {getDocLabel(doc)}  •  Created {getUpdatedDate(doc)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleLongPress(doc)}
                      style={styles.threeDotsBtn}
                    >
                      <Text style={styles.threeDots}>⋮</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Bottom row: Open + Edit + Export */}
                  <View style={styles.docCardActions}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleOpenDoc(doc)}
                      style={styles.docOpenBtn}
                    >
                      <Text style={styles.docOpenText}>Open</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleEditDoc(doc)}
                      style={styles.docEditBtn}
                    >
                      <Text style={styles.docEditText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleExportDoc(doc)}
                      style={styles.docExportBtn}
                    >
                      <Text style={styles.docExportText}>⬇</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Footer: + Create Document */}
      {filteredDocs.length > 0 && (
        <View style={styles.footerBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DocumentTypeSelector', { initialType: 'resume' })}
            style={styles.createDocBtn}
          >
            <Text style={styles.createDocText}>+  Create Document</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Screen 37: Delete Confirmation Modal */}
      <Modal visible={!!deleteTarget} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.deleteModal}>
            {/* Red trash icon */}
            <View style={styles.deleteIconCircle}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </View>

            <Text style={styles.deleteTitle}>Delete this document?</Text>
            <Text style={styles.deleteSubtitle}>
              {getDocName(deleteTarget || ({} as AnyDocumentProfile))} will be permanently{"\n"}deleted from this device.
            </Text>

            {/* File info card */}
            {deleteTarget && (
              <View style={styles.deleteFileCard}>
                <View style={styles.deletePdfBadge}>
                  <Text style={styles.deletePdfText}>PDF</Text>
                </View>
                <View>
                  <Text style={styles.deleteFileName}>{getDocName(deleteTarget)}</Text>
                  <Text style={styles.deleteFileMeta}>PDF  •  2.4 MB</Text>
                </View>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.deleteBtnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setDeleteTarget(null)}
                style={styles.deleteCancelBtn}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={confirmDelete}
                style={styles.deleteConfirmBtn}
              >
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort & Settings Modal */}
      <Modal visible={showSortModal} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
          style={styles.sortModalBackdrop}
        >
          <View style={styles.sortModalSheet}>
            {/* Handle bar */}
            <View style={styles.sortHandle} />

            <Text style={styles.sortModalTitle}>Sort & Display</Text>
            <Text style={styles.sortModalSubtitle}>Choose how documents are organized</Text>

            {SORT_OPTIONS.map((opt) => {
              const isActive = activeSort === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  activeOpacity={0.8}
                  onPress={() => {
                    setActiveSort(opt.key);
                    setShowSortModal(false);
                  }}
                  style={[
                    styles.sortOption,
                    isActive && styles.sortOptionActive,
                  ]}
                >
                  <Text style={styles.sortOptionIcon}>{opt.icon}</Text>
                  <Text style={[
                    styles.sortOptionLabel,
                    isActive && styles.sortOptionLabelActive,
                  ]}>{opt.label}</Text>
                  {isActive && <Text style={styles.sortCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowSortModal(false)}
              style={styles.sortDoneBtn}
            >
              <Text style={styles.sortDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Context Menu Modal (long-press) */}
      <Modal visible={!!contextMenuTarget} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setContextMenuTarget(null)}
          style={styles.contextBackdrop}
        >
          <View style={styles.contextSheet}>
            {/* Document info header */}
            {contextMenuTarget && (
              <View style={styles.contextHeader}>
                <View style={[styles.contextIconBox, { backgroundColor: getDocIcon(contextMenuTarget).bg }]}>
                  <Text style={{ fontSize: 20 }}>{getDocIcon(contextMenuTarget).icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contextDocName} numberOfLines={1}>{getDocName(contextMenuTarget)}</Text>
                  <Text style={styles.contextDocMeta}>{getDocLabel(contextMenuTarget)}  •  {getUpdatedDate(contextMenuTarget)}</Text>
                </View>
              </View>
            )}

            <View style={styles.contextDivider} />

            {/* Action items */}
            {[
              { id: 'open', icon: '📂', label: 'Open Preview', color: '#2563EB' },
              { id: 'edit', icon: '✏️', label: 'Edit Document', color: '#7C3AED' },
              { id: 'rename', icon: '✎', label: 'Rename', color: '#0D9488' },
              { id: 'duplicate', icon: '📋', label: 'Duplicate', color: '#0284C7' },
              { id: 'share', icon: '📤', label: 'Share', color: '#059669' },
              { id: 'delete', icon: '🗑️', label: 'Delete', color: '#DC2626' },
            ].map((action) => (
              <TouchableOpacity
                key={action.id}
                activeOpacity={0.8}
                onPress={() => handleContextAction(action.id)}
                style={[
                  styles.contextAction,
                  action.id === 'delete' && styles.contextActionDanger,
                ]}
              >
                <Text style={styles.contextActionIcon}>{action.icon}</Text>
                <Text style={[
                  styles.contextActionLabel,
                  action.id === 'delete' && styles.contextActionLabelDanger,
                ]}>{action.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setContextMenuTarget(null)}
              style={styles.contextCancelBtn}
            >
              <Text style={styles.contextCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ResumeBottomNav active="documents" onNavigate={handleNavigation} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // ── Header ──
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 18,
  },

  // ── Filter Tabs ──
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabLabelActive: {
    color: '#FFFFFF',
  },

  // ── Scroll ──
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },

  // ── Empty State (Screen 38) ──
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  emptyIllustrationIcon: {
    fontSize: 48,
  },
  emptyPlusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyPrimaryBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    marginBottom: 12,
  },
  emptyPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyOutlineBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2563EB',
    marginBottom: 24,
  },
  emptyOutlineText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emptyInfoIcon: {
    fontSize: 14,
  },
  emptyInfoText: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // ── Document Cards (Screen 33) ──
  listContainer: {
    gap: 12,
  },
  docCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  docCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  docIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconText: {
    fontSize: 22,
  },
  docInfo: {
    flex: 1,
    marginLeft: 12,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  docMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  threeDotsBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threeDots: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '700',
  },
  docCardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  docOpenBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    alignItems: 'center',
  },
  docOpenText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  docEditBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docEditText: {
    fontSize: 16,
  },
  docExportBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docExportText: {
    fontSize: 16,
    color: '#2563EB',
  },

  // ── Footer ──
  footerBar: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  createDocBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  createDocText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // ── Delete Modal (Screen 37) ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  deleteModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  deleteIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteIcon: {
    fontSize: 28,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  deleteSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  deleteFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 12,
  },
  deletePdfBadge: {
    width: 40,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletePdfText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  deleteFileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  deleteFileMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  deleteBtnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  deleteCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  deleteCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  deleteConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  deleteConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Sort Modal ──
  sortModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sortModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  sortHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 18,
  },
  sortModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  sortModalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    gap: 12,
  },
  sortOptionActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  sortOptionIcon: {
    fontSize: 18,
  },
  sortOptionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  sortOptionLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  sortCheck: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  sortDoneBtn: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  sortDoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // ── Context Menu ──
  contextBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  contextSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  contextIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextDocName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  contextDocMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  contextDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  contextAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 14,
  },
  contextActionDanger: {
    marginTop: 4,
  },
  contextActionIcon: {
    fontSize: 18,
  },
  contextActionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  contextActionLabelDanger: {
    color: '#DC2626',
    fontWeight: '700',
  },
  contextCancelBtn: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contextCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
});
