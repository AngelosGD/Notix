// src/screens/AddTask/AddTaskModal.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

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
function TaskItem({ task, onToggle, onDelete, accent, cardBg, textColor, subColor, divColor }) {
  return (
    <View style={[styles.taskCard, { borderLeftColor: task.borderColor, backgroundColor: cardBg }]}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxDone, { borderColor: divColor }]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        {task.completed && <Text style={[styles.checkmark, { color: accent }]}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.taskInfo}>
        <Text
          style={[styles.taskTitle, task.completed && styles.taskTitleDone, { color: textColor }]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <Text style={[styles.taskSub, { color: subColor }]}>{task.subtitle}</Text>
      </View>

      <View style={styles.taskActions}>
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
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(task.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── FilterPill ──────────────────────────────────────────────────────────────
function FilterPill({ label, active, onPress, accent, cardBg, textColor, subColor, divColor }) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive, { borderColor: divColor }, active && { backgroundColor: accent, borderColor: accent }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive, { color: active ? cardBg : subColor }]}>
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
  onDeleteTask,
  navigation,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [activeTab, setActiveTab] = useState('Tareas'); // 'Notas' | 'Tareas'
  const insets = useSafeAreaInsets();
  const { accent, bg, cardBg, textColor, subColor, divColor } = useTheme();

  const handleTabPress = (tab) => {
    if (tab === 'Notas') {
      navigation.navigate('Notes');
    } else {
      setActiveTab(tab);
    }
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      subtitle: 'Hoy · Personal',
      tag: null,
      tagColor: null,
      borderColor: accent,
    });
    setNewTitle('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={bg} />

      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Folders')}>
            <Ionicons name="folder-outline" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Agregar Tareas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* ── Search bar ── */}
        <View style={[styles.searchBar, { backgroundColor: cardBg, borderColor: accent }]}>
          <View style={[styles.searchCircle, { borderColor: accent }]}>
            <Ionicons name="search" size={16} color={accent} />
          </View>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Buscar tarea..."
            placeholderTextColor={subColor}
            value={search}
            onChangeText={onSearchChange}
          />
        </View>

        {/* ── Section label + filters ── */}
        <Text style={[styles.sectionLabel, { color: textColor }]}>Mis tareas</Text>
        <View style={styles.filters}>
          {['Todas', 'Activas', 'Hechas'].map((f) => (
            <FilterPill
              key={f}
              label={f}
              active={filter === f}
              onPress={() => onFilterChange(f)}
              accent={accent}
              cardBg={cardBg}
              textColor={textColor}
              subColor={subColor}
              divColor={divColor}
            />
          ))}
        </View>

        {/* ── Task list ── */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem 
              task={item} 
              onToggle={onToggleTask} 
              onDelete={onDeleteTask}
              accent={accent}
              cardBg={cardBg}
              textColor={textColor}
              subColor={subColor}
              divColor={divColor}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}
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
        style={[styles.fab, { bottom: 70 + insets.bottom, backgroundColor: accent, shadowColor: accent }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={[styles.fabIcon, { color: bg }]}>+</Text>
      </TouchableOpacity>

      {/* ── Bottom nav ── */}
      <View style={[styles.bottomNav, { bottom: insets.bottom, backgroundColor: cardBg, borderTopColor: divColor }]}>
        {['Notas', 'Tareas'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navLabel,
                activeTab === tab && styles.navLabelActive,
                { color: activeTab === tab ? accent : subColor },
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
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
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
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 6,
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
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1001,
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  navLabelActive: {
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