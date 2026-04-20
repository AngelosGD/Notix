// src/screens/AddTask/AddTaskModal.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg: '#0E0E0E',
  surface: '#1A1A1A',
  surfaceAlt: '#141414',
  border: '#2A2A2A',
  teal: '#2EE5AC',
  tealDim: 'rgba(46,229,172,0.15)',
  text: '#FFFFFF',
  textMuted: '#6B6B6B',
  textDim: '#3D3D3D',
  tagUrgente: '#FF4444',
  tagTrabajo: '#6C63FF',
};

// ─── TaskItem ────────────────────────────────────────────────────────────────
function TaskItem({ task, onToggle }) {
  return (
    <View style={[styles.taskCard, { borderLeftColor: task.borderColor }]}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxDone]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskTitle, task.completed && styles.taskTitleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <Text style={styles.taskSub}>{task.subtitle}</Text>
      </View>

      {task.tag && (
        <View
          style={[
            styles.tag,
            { backgroundColor: task.tagColor + '22', borderColor: task.tagColor },
          ]}
        >
          <Text style={[styles.tagText, { color: task.tagColor }]}>
            {task.tag}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── FilterPill ──────────────────────────────────────────────────────────────
function FilterPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── AddTaskModal (main export) ──────────────────────────────────────────────
export default function AddTaskModal({
  tasks,
  filter,
  search,
  upcomingCount,
  onFilterChange,
  onSearchChange,
  onToggleTask,
  onAddTask,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [activeTab, setActiveTab] = useState('Tareas'); // 'Notas' | 'Tareas'

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      subtitle: 'Hoy · Personal',
      tag: null,
      tagColor: null,
      borderColor: C.teal,
    });
    setNewTitle('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.container}>
        {/* ── Header ── */}
        <Text style={styles.header}>Agregar Tareas</Text>

        {/* ── Search bar ── */}
        <View style={styles.searchBar}>
          <View style={styles.searchCircle} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar tarea..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={onSearchChange}
          />
        </View>

        {/* ── Section label + filters ── */}
        <Text style={styles.sectionLabel}>Mis tareas</Text>
        <View style={styles.filters}>
          {['Todas', 'Activas', 'Hechas'].map((f) => (
            <FilterPill
              key={f}
              label={f}
              active={filter === f}
              onPress={() => onFilterChange(f)}
            />
          ))}
        </View>

        {/* ── Task list ── */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={onToggleTask} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              {/* ── Divider ── */}
              <View style={styles.divider} />

              {/* ── Upcoming ── */}
              <Text style={styles.sectionLabel}>
                Próximas ({upcomingCount})
              </Text>
              <TouchableOpacity style={styles.upcomingCard} activeOpacity={0.7}>
                <View style={styles.upcomingPlus}>
                  <Text style={styles.upcomingPlusText}>+</Text>
                </View>
                <Text style={styles.upcomingText}>
                  Tareas agrupadas pendientes...
                </Text>
              </TouchableOpacity>
              <View style={{ height: 80 }} />
            </>
          }
        />
      </View>

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* ── Bottom nav ── */}
      <View style={styles.bottomNav}>
        {['Notas', 'Tareas'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
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

      {/* ── Add Task Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Nueva tarea</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la tarea..."
              placeholderTextColor={C.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.modalBtn,
                !newTitle.trim() && styles.modalBtnDisabled,
              ]}
              onPress={handleAdd}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Header
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
    marginBottom: 20,
    letterSpacing: 0.2,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  // Filters
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: C.teal,
    borderColor: C.teal,
  },
  pillText: {
    color: C.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  pillTextActive: {
    color: C.bg,
    fontWeight: '700',
  },

  // Task card
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: C.tealDim,
    borderColor: C.teal,
  },
  checkmark: {
    color: C.teal,
    fontSize: 13,
    fontWeight: '700',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  taskTitleDone: {
    color: C.textMuted,
    textDecorationLine: 'line-through',
  },
  taskSub: {
    color: C.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 20,
  },

  // Upcoming
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.teal,
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    backgroundColor: 'transparent',
  },
  upcomingPlus: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingPlusText: {
    color: C.teal,
    fontSize: 16,
    fontWeight: '600',
  },
  upcomingText: {
    color: C.textMuted,
    fontSize: 14,
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
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    color: C.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  navLabelActive: {
    color: C.teal,
    fontWeight: '600',
  },

  // Modal sheet
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderColor: C.border,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: C.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  modalBtn: {
    backgroundColor: C.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalBtnDisabled: {
    opacity: 0.4,
  },
  modalBtnText: {
    color: C.bg,
    fontWeight: '700',
    fontSize: 15,
  },
});