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
  Modal,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// ─── Palette────────────────────────────────────
const C = {
  bg:         '#0E0E0E',
  surface:    '#1A1A1A',
  surfaceAlt: '#141414',
  border:     '#2A2A2A',
  teal:       '#2EE5AC',
  tealDim:    'rgba(46,229,172,0.12)',
  text:       '#FFFFFF',
  textMuted:  '#6B6B6B',
  yellow:     '#F5C518',
  pink:       '#FF4D6D',
  purple:     '#7C63FF',
};

// ─── Colores disponibles para las notas ──────────────────────────────────────
const NOTE_COLORS = [
  { id: 'c1', color: '#2A2A2A' },
  { id: 'c2', color: C.teal   },
  { id: 'c3', color: C.purple },
  { id: 'c4', color: '#FF6B5B'},
];

const RELATED_TAGS = ['Tareas', 'Personal', 'Proyecto'];

// ─── Componente PinnedCard ────────────────────────────────────────────────────
function PinnedCard({ note, onLongPress }) {
  return (
    <Pressable
      style={[styles.pinnedCard, { borderColor: note.accentColor || C.teal }]}
      onLongPress={() => onLongPress(note)}
      delayLongPress={400}
      android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
    >
      <Text style={styles.pinnedText} numberOfLines={2}>{note.title}</Text>
    </Pressable>
  );
}

// ─── Componente RecentCard ────────────────────────────────────────────────────
function RecentCard({ note, onLongPress }) {
  return (
    <Pressable
      style={[styles.recentCard, { borderLeftColor: note.accentColor || C.teal }]}
      onLongPress={() => onLongPress(note)}
      delayLongPress={400}
      android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
    >
      <Text style={styles.recentText} numberOfLines={1}>{note.title}</Text>
    </Pressable>
  );
}

// ─── Panel de personalización (aparece al hacer long press) ──────────────────
function CustomizePanel({ note, onClose, onSave }) {
  const [selectedColor, setSelectedColor] = useState(
    NOTE_COLORS.find(c => c.color === note.accentColor)?.id || 'c1'
  );
  const [selectedTags, setSelectedTags] = useState(note.tags || []);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleGuardar = () => {
    const colorElegido = NOTE_COLORS.find(c => c.id === selectedColor)?.color || C.teal;
    onSave({ ...note, accentColor: colorElegido, tags: selectedTags });
    onClose();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header con botón volver */}
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Volver</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.detailTitle}>{note.title}</Text>
        <Text style={styles.detailSubtitle}>
          {note.content ? note.content.substring(0, 60) + '...' : 'Sin contenido'}
        </Text>

        {/* Tags relacionados */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Etiquetas</Text>
          <View style={styles.tagsRow}>
            {RELATED_TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.75}
              >
                <View style={[styles.tagCheckbox, selectedTags.includes(tag) && styles.tagCheckboxActive]}>
                  {selectedTags.includes(tag) && <Text style={styles.tagCheck}>✓</Text>}
                </View>
                <Text style={[styles.tagLabel, selectedTags.includes(tag) && styles.tagLabelActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Color de la nota</Text>
          <View style={styles.colorRow}>
            {NOTE_COLORS.map(c => (
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
        </View>

        {/* Botón guardar cambios */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Guardar cambios</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Text style={styles.navLabel}>Notas</Text>
        <Text style={[styles.navLabel, styles.navLabelMuted]}>Tareas</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Modal para crear nota nueva ─────────────────────────────────────────────
function CrearNotaModal({ visible, onClose, onCrear }) {
  const [titulo,    setTitulo]    = useState('');
  const [contenido, setContenido] = useState('');
  const [pinned,    setPinned]    = useState(false);

  const handleCrear = () => {
    if (!titulo.trim()) {
      Alert.alert('Título requerido', 'Por favor escribe un título para la nota.');
      return;
    }

    const nuevaNota = {
      id:          Date.now().toString(),
      title:       titulo.trim(),
      content:     contenido.trim(),
      pinned:      pinned,
      accentColor: C.teal,
      tags:        [],
      fecha:       new Date().toISOString(),
    };

    onCrear(nuevaNota);
    // Limpiar el form
    setTitulo('');
    setContenido('');
    setPinned(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCard}>

          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Nota</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Input título */}
          <TextInput
            style={styles.inputTitulo}
            placeholder="Título de la nota..."
            placeholderTextColor={C.textMuted}
            value={titulo}
            onChangeText={setTitulo}
            maxLength={80}
            autoFocus
          />

          {/* Input contenido */}
          <TextInput
            style={styles.inputContenido}
            placeholder="Escribe tu nota aquí..."
            placeholderTextColor={C.textMuted}
            value={contenido}
            onChangeText={setContenido}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          {/* Toggle fijar nota */}
          <TouchableOpacity
            style={styles.pinnedToggle}
            onPress={() => setPinned(p => !p)}
            activeOpacity={0.75}
          >
            <View style={[styles.pinnedCheckbox, pinned && styles.pinnedCheckboxActive]}>
              {pinned && <Text style={styles.pinnedCheck}>✓</Text>}
            </View>
            <Text style={styles.pinnedToggleLabel}>Fijar nota (aparece arriba)</Text>
          </TouchableOpacity>

          {/* Botones */}
          <View style={styles.modalBtns}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose} activeOpacity={0.75}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCrear} onPress={handleCrear} activeOpacity={0.85}>
              <Text style={styles.btnCrearText}>Crear nota</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── NoteForm — Export principal ─────────────────────────────────────────────
export default function NoteForm({ navigation }) {
  const [search,       setSearch]       = useState('');
  const [notas,        setNotas]        = useState([]);   // todas las notas creadas
  const [selectedNote, setSelectedNote] = useState(null); // nota en panel customize
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab,    setActiveTab]    = useState('Notas');

  // Separar fijadas vs recientes
  const notasFijadas   = notas.filter(n => n.pinned);
  const notasRecientes = notas.filter(n => !n.pinned);

  // Filtrar por búsqueda
  const filtrar = (lista) =>
    lista.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  // Crear nota nueva
  const handleCrear = (nuevaNota) => {
    setNotas(prev => [nuevaNota, ...prev]);
  };

  // Guardar cambios de personalización
  const handleGuardarCustomize = (notaActualizada) => {
    setNotas(prev => prev.map(n => n.id === notaActualizada.id ? notaActualizada : n));
  };

  // Eliminar nota (long press → panel → botón eliminar si se quiere agregar)
  const handleEliminar = (id) => {
    Alert.alert('Eliminar nota', '¿Seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        setNotas(prev => prev.filter(n => n.id !== id));
        setSelectedNote(null);
      }},
    ]);
  };

  // Si hay nota seleccionada → mostrar panel customize
  if (selectedNote) {
    return (
      <CustomizePanel
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onSave={handleGuardarCustomize}
      />
    );
  }

  const fijadas   = filtrar(notasFijadas);
  const recientes = filtrar(notasRecientes);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.header}>Notas</Text>

        {/* Buscador */}
        <View style={styles.searchBar}>
          <View style={styles.searchCircle} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar nota..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: C.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notas fijadas */}
        {fijadas.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Mensajes fijados</Text>
            <View style={styles.pinnedGrid}>
              {fijadas.map(note => (
                <PinnedCard key={note.id} note={note} onLongPress={setSelectedNote} />
              ))}
            </View>
          </>
        )}

        {/* Notas recientes */}
        {recientes.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: fijadas.length > 0 ? 24 : 0 }]}>
              Recientes
            </Text>
            {recientes.map(note => (
              <View key={note.id} style={{ marginBottom: 10 }}>
                <RecentCard note={note} onLongPress={setSelectedNote} />
              </View>
            ))}
          </>
        )}

        {/* Estado vacío */}
        {notas.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No tienes notas todavía</Text>
            <Text style={styles.emptySubtext}>Toca el + para crear tu primera nota</Text>
          </View>
        )}

        {/* Sin resultados en búsqueda */}
        {notas.length > 0 && fijadas.length === 0 && recientes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Sin resultados para "{search}"</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {['Notas', 'Tareas'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => {
              setActiveTab(tab);
              if (tab === 'Tareas') navigation.navigate('AddTask');
            }}
          >
            <Text style={[styles.navLabel, activeTab !== tab && styles.navLabelMuted]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal crear nota */}
      <CrearNotaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCrear={handleCrear}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────
const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },

  header: { fontSize: 28, fontWeight: '700', color: C.text, marginBottom: 20 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 14, borderWidth: 1, borderColor: C.teal,
    paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 24, gap: 10,
  },
  searchCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: C.teal },
  searchInput:  { flex: 1, color: C.text, fontSize: 15, padding: 0 },

  sectionLabel: { color: C.text, fontSize: 15, fontWeight: '600', marginBottom: 12 },

  pinnedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pinnedCard: {
    width: '47%', backgroundColor: C.surface,
    borderRadius: 12, borderWidth: 1.5,
    padding: 16, minHeight: 72, justifyContent: 'center',
  },
  pinnedText: { color: C.text, fontSize: 14, fontWeight: '500', lineHeight: 20 },

  recentCard: {
    backgroundColor: C.surface, borderRadius: 12,
    borderLeftWidth: 3, paddingHorizontal: 16, paddingVertical: 16,
  },
  recentText: { color: C.text, fontSize: 15 },

  fab: {
    position: 'absolute', bottom: 70, right: 20,
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: C.teal,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.teal, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  fabIcon: { color: C.bg, fontSize: 28, fontWeight: '300', lineHeight: 32 },

  bottomNav: {
    flexDirection: 'row', borderTopWidth: 1,
    borderTopColor: C.border, paddingVertical: 12, backgroundColor: C.bg,
  },
  navItem:       { flex: 1, alignItems: 'center' },
  navLabel:      { color: C.teal, fontSize: 14, fontWeight: '600' },
  navLabelMuted: { color: C.textMuted, fontWeight: '500' },

  // Customize panel
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backArrow:    { color: C.teal, fontSize: 20, fontWeight: '300' },
  backLabel:    { color: C.teal, fontSize: 16, fontWeight: '600' },
  detailTitle:    { fontSize: 28, fontWeight: '700', color: C.text, lineHeight: 36, marginBottom: 8 },
  detailSubtitle: { fontSize: 14, color: C.textMuted, marginBottom: 28 },

  section: { backgroundColor: C.surface, borderRadius: 14, padding: 16, marginBottom: 16 },

  tagsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  tagChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surfaceAlt, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, gap: 8,
    borderWidth: 1, borderColor: C.border,
  },
  tagChipActive:     { borderColor: C.teal, backgroundColor: C.tealDim },
  tagCheckbox:       { width: 16, height: 16, borderRadius: 3, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  tagCheckboxActive: { borderColor: C.teal, backgroundColor: C.tealDim },
  tagCheck:          { color: C.teal, fontSize: 9, fontWeight: '700' },
  tagLabel:          { color: C.textMuted, fontSize: 13 },
  tagLabelActive:    { color: C.teal },

  colorRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 4, marginTop: 8 },
  colorSwatch: { width: 52, height: 52, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  colorSwatchActive: { borderColor: C.text, transform: [{ scale: 1.1 }] },

  saveBtn:     { backgroundColor: C.teal, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: C.bg, fontSize: 16, fontWeight: '700' },

  // Modal crear nota
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle:     { color: C.text, fontSize: 20, fontWeight: '700' },
  modalCloseBtn:  { padding: 4 },
  modalCloseText: { color: C.textMuted, fontSize: 18 },

  inputTitulo: {
    backgroundColor: C.surfaceAlt, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    color: C.text, fontSize: 16, fontWeight: '600',
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 12,
  },
  inputContenido: {
    backgroundColor: C.surfaceAlt, borderRadius: 12,
    borderWidth: 1, borderColor: C.border,
    color: C.text, fontSize: 14,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 16, height: 120,
  },

  pinnedToggle:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  pinnedCheckbox:      { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  pinnedCheckboxActive:{ borderColor: C.teal, backgroundColor: C.tealDim },
  pinnedCheck:         { color: C.teal, fontSize: 11, fontWeight: '700' },
  pinnedToggleLabel:   { color: C.textMuted, fontSize: 14 },

  modalBtns:     { flexDirection: 'row', gap: 12 },
  btnCancelar:   { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  btnCancelarText: { color: C.textMuted, fontSize: 15, fontWeight: '600' },
  btnCrear:      { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', backgroundColor: C.teal },
  btnCrearText:  { color: C.bg, fontSize: 15, fontWeight: '700' },

  // Empty state
  emptyState:   { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon:    { fontSize: 48 },
  emptyText:    { color: C.text, fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: C.textMuted, fontSize: 14 },
});