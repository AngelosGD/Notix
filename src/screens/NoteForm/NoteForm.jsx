// src/screens/NoteForm/NoteForm.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Pressable,
} from 'react-native';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: '#0E0E0E',
  surface: '#1A1A1A',
  surfaceAlt: '#141414',
  border: '#2A2A2A',
  teal: '#2EE5AC',
  tealDim: 'rgba(46,229,172,0.12)',
  text: '#FFFFFF',
  textMuted: '#6B6B6B',
  yellow: '#F5C518',
  pink: '#FF4D6D',
  purple: '#7C63FF',
  green: '#2EE5AC',
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const PINNED_NOTES = [
  { id: '1', title: 'Preparar presentación', color: C.yellow },
  { id: '2', title: 'Lista de compos', color: C.purple },
  { id: '3', title: 'Revisar reporte', color: C.yellow },
  { id: '4', title: 'Revisar reporte', color: C.purple },
];

const RECENT_NOTES = [
  { id: '5', title: 'Notas de reunión del viernes', color: C.teal },
  { id: '6', title: 'Ideas para el proyecto de app', color: C.pink },
];

const AI_SUGGESTIONS = [
  { id: 'a1', label: 'Mejorar UI', checked: false },
  { id: 'a2', label: 'Agregar modo oscuro', checked: true, color: C.yellow },
  { id: 'a3', label: 'Soporte multi-idioma', checked: false },
];

const RELATED_TAGS = ['Tareas', 'Personal', 'Proyecto'];

const NOTE_COLORS = [
  { id: 'c1', color: '#2A2A2A' },
  { id: 'c2', color: C.teal },
  { id: 'c3', color: C.purple },
  { id: 'c4', color: '#FF6B5B' },
];

// ─── PinnedCard ──────────────────────────────────────────────────────────────
function PinnedCard({ note, onLongPress }) {
  return (
    <Pressable
      style={[styles.pinnedCard, { borderColor: note.color }]}
      onLongPress={() => onLongPress(note)}
      delayLongPress={400}
      android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
    >
      <Text style={styles.pinnedText}>{note.title}</Text>
    </Pressable>
  );
}

// ─── RecentCard ──────────────────────────────────────────────────────────────
function RecentCard({ note, onLongPress }) {
  return (
    <Pressable
      style={[styles.recentCard, { borderLeftColor: note.color }]}
      onLongPress={() => onLongPress(note)}
      delayLongPress={400}
      android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
    >
      <Text style={styles.recentText}>{note.title}</Text>
    </Pressable>
  );
}

// ─── Customize Panel (right screen) ─────────────────────────────────────────
function CustomizePanel({ note, onClose }) {
  const [suggestions, setSuggestions] = useState(AI_SUGGESTIONS);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].id);

  const toggleSuggestion = (id) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Back header ── */}
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}># 304</Text>
          </TouchableOpacity>
        </View>

        {/* ── Note title ── */}
        <Text style={styles.detailTitle}>{note.title}</Text>
        <Text style={styles.detailSubtitle}>Notas para mejorar la aplicacion</Text>

        {/* ── AI Suggestions ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sugerencias IA</Text>
          {suggestions.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.suggestionRow,
                s.checked && s.color && { borderColor: s.color, borderWidth: 1 },
              ]}
              onPress={() => toggleSuggestion(s.id)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.suggCheckbox,
                  s.checked && {
                    backgroundColor: s.color ? s.color + '33' : C.tealDim,
                    borderColor: s.color || C.teal,
                  },
                ]}
              >
                {s.checked && (
                  <Text style={[styles.suggCheck, { color: s.color || C.teal }]}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={styles.suggLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Related tags ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Relacionados</Text>
          <View style={styles.tagsRow}>
            {RELATED_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  selectedTags.includes(tag) && styles.tagChipActive,
                ]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.tagCheckbox,
                    selectedTags.includes(tag) && styles.tagCheckboxActive,
                  ]}
                >
                  {selectedTags.includes(tag) && (
                    <Text style={styles.tagCheck}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.tagLabel,
                    selectedTags.includes(tag) && styles.tagLabelActive,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Color picker ── */}
        <View style={styles.colorRow}>
          {NOTE_COLORS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.colorSwatch,
                { backgroundColor: c.color },
                selectedColor === c.id && styles.colorSwatchActive,
              ]}
              onPress={() => setSelectedColor(c.id)}
              activeOpacity={0.8}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Bottom nav ── */}
      <View style={styles.bottomNav}>
        <Text style={styles.navLabel}>Notas</Text>
        <Text style={[styles.navLabel, styles.navLabelMuted]}>Tareas</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── NoteForm (main export) ──────────────────────────────────────────────────
export default function NoteForm() {
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState('Notas');

  const handleLongPress = (note) => {
    setSelectedNote(note);
  };

  const handleCloseCustomize = () => {
    setSelectedNote(null);
  };

  // Show customize panel on long press
  if (selectedNote) {
    return (
      <CustomizePanel note={selectedNote} onClose={handleCloseCustomize} />
    );
  }

  // ── Normal list view ──
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text style={styles.header}>Notas</Text>

        {/* ── Search ── */}
        <View style={styles.searchBar}>
          <View style={styles.searchCircle} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar nota..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ── Pinned ── */}
        <Text style={styles.sectionLabel}>Mensajes fijados</Text>
        <View style={styles.pinnedGrid}>
          {PINNED_NOTES.map((note) => (
            <PinnedCard
              key={note.id}
              note={note}
              onLongPress={handleLongPress}
            />
          ))}
        </View>

        {/* ── Recent ── */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Recientes</Text>
        {RECENT_NOTES.map((note) => (
          <View key={note.id} style={{ marginBottom: 10 }}>
            <RecentCard note={note} onLongPress={handleLongPress} />
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* ── Bottom nav ── */}
      <View style={styles.bottomNav}>
        {['Notas', 'Tareas'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.navLabel,
                activeTab === tab && styles.navLabelActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },

  // Header
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
    marginBottom: 20,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.teal,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
    gap: 10,
  },
  searchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: C.teal,
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontSize: 15,
    padding: 0,
  },

  // Section label
  sectionLabel: {
    color: C.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },

  // Pinned grid
  pinnedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pinnedCard: {
    width: '47%',
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 72,
    justifyContent: 'center',
  },
  pinnedText: {
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Recent cards
  recentCard: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  recentText: {
    color: C.text,
    fontSize: 15,
    fontWeight: '400',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    color: C.bg,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingVertical: 12,
    backgroundColor: C.bg,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navLabel: {
    color: C.teal,
    fontSize: 14,
    fontWeight: '600',
  },
  navLabelActive: {
    color: C.teal,
    fontWeight: '600',
  },
  navLabelMuted: {
    color: C.textMuted,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },

  // ── Customize panel styles ──
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backArrow: {
    color: C.teal,
    fontSize: 20,
    fontWeight: '300',
  },
  backLabel: {
    color: C.teal,
    fontSize: 16,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
    lineHeight: 36,
    marginBottom: 8,
  },
  detailSubtitle: {
    fontSize: 14,
    color: C.textMuted,
    marginBottom: 28,
  },

  // Section
  section: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  // AI Suggestions
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
    gap: 12,
    backgroundColor: C.surfaceAlt,
  },
  suggCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggCheck: {
    fontSize: 11,
    fontWeight: '700',
  },
  suggLabel: {
    color: C.text,
    fontSize: 14,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  tagChipActive: {
    borderColor: C.teal,
    backgroundColor: C.tealDim,
  },
  tagCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagCheckboxActive: {
    borderColor: C.teal,
    backgroundColor: C.tealDim,
  },
  tagCheck: {
    color: C.teal,
    fontSize: 9,
    fontWeight: '700',
  },
  tagLabel: {
    color: C.textMuted,
    fontSize: 13,
  },
  tagLabelActive: {
    color: C.teal,
  },

  // Color picker
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderColor: C.text,
    transform: [{ scale: 1.1 }],
  },
});
