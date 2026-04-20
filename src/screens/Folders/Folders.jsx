import { useState, useEffect, useMemo } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  FlatList, StatusBar, Alert, Modal, KeyboardAvoidingView, Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../../lib/supabase'

export default function Folders({ navigation }) {
  const { bg, cardBg, textColor, subColor, accent } = useTheme()

  const [folders,       setFolders]       = useState([])
  const [search,        setSearch]        = useState('')
  const [sortBy,        setSortBy]        = useState('name')
  const [modalVisible,  setModalVisible]  = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [loading,       setLoading]       = useState(true)

  /* ── cargar carpetas desde Supabase ── */
  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('folder_note_count')
      .select('*')
    if (!error) setFolders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchFolders()
    // recargar al volver a esta pantalla
    const unsub = navigation.addListener('focus', fetchFolders)
    return unsub
  }, [navigation])

  /* ── derived ── */
  const allCount = folders.reduce((s, f) => s + Number(f.count), 0)

  const filtered = useMemo(() => {
    let list = folders.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase())
    )
    if (sortBy === 'name')  list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'count') list = [...list].sort((a, b) => b.count - a.count)
    return list
  }, [folders, search, sortBy])

  const pinned   = filtered.filter(f =>  f.pinned)
  const unpinned = filtered.filter(f => !f.pinned)

  /* ── acciones ── */
  const createFolder = async () => {
    const name = newFolderName.trim()
    if (!name) return
    const { error } = await supabase
      .from('folders')
      .insert({ name, pinned: false })
    if (!error) {
      setNewFolderName('')
      setModalVisible(false)
      fetchFolders()
    }
  }

  const togglePin = async (id, current) => {
    await supabase.from('folders').update({ pinned: !current }).eq('id', id)
    fetchFolders()
  }

  const deleteFolder = (id, name) =>
    Alert.alert(
      'Eliminar carpeta',
      `¿Eliminar "${name}"? Las notas se moverán a "All".`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive',
          onPress: async () => {
            await supabase.from('folders').delete().eq('id', id)
            fetchFolders()
          },
        },
      ]
    )

  const deleteAll = () =>
    Alert.alert('Eliminar todas', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          await supabase.from('folders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
          fetchFolders()
        },
      },
    ])

  /* ── sub-componentes ── */
  const SortBtn = ({ label, value }) => {
    const active = sortBy === value
    return (
      <TouchableOpacity
        style={[styles.sortBtn, { backgroundColor: active ? accent : cardBg }]}
        onPress={() => setSortBy(value)}
      >
        <Text style={[styles.sortBtnText, { color: active ? '#111' : subColor }]}>{label}</Text>
      </TouchableOpacity>
    )
  }

  const FolderRow = ({ item }) => (
    <TouchableOpacity
      style={[styles.folderRow, { backgroundColor: cardBg }]}
      onPress={() => navigation.navigate('Notes', { folderId: item.id, folderName: item.name })}
      onLongPress={() => deleteFolder(item.id, item.name)}
      activeOpacity={0.75}
    >
      <Ionicons name="folder-outline" size={20} color={subColor} />
      <Text style={[styles.folderName, { color: textColor }]} numberOfLines={1}>{item.name}</Text>
      {item.pinned && <Ionicons name="bookmark" size={13} color={accent} />}
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={() => togglePin(item.id, item.pinned)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={item.pinned ? 'bookmark' : 'bookmark-outline'}
          size={17}
          color={item.pinned ? accent : subColor}
        />
      </TouchableOpacity>
      <Text style={[styles.countText, { color: subColor }]}>{item.count}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Folders</Text>
        <TouchableOpacity onPress={deleteAll} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: cardBg }]}>
        <Ionicons name="search-outline" size={18} color={subColor} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search folders..."
          placeholderTextColor={subColor}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={subColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        <SortBtn label="Name"  value="name"  />
        <SortBtn label="Date"  value="date"  />
        <SortBtn label="Count" value="count" />
      </View>

      <FlatList
        data={[]}
        keyExtractor={() => 'h'}
        ListHeaderComponent={() => (
          <>
            {/* All */}
            <TouchableOpacity
              style={[styles.allRow, { backgroundColor: cardBg }]}
              onPress={() => navigation.navigate('Notes', { folderId: null, folderName: 'All' })}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark" size={18} color={accent} />
              <Text style={[styles.allLabel, { color: textColor }]}>All</Text>
              <View style={{ flex: 1 }} />
              <Text style={[styles.countText, { color: subColor }]}>{allCount}</Text>
            </TouchableOpacity>

            {/* New folder */}
            <TouchableOpacity
              style={[styles.newFolderCard, { backgroundColor: cardBg }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.75}
            >
              <View style={[styles.plusCircle, { backgroundColor: accent }]}>
                <Ionicons name="add" size={28} color="#111" />
              </View>
              <Text style={[styles.newFolderLabel, { color: textColor }]}>New folder</Text>
            </TouchableOpacity>

            {/* Pinned */}
            {pinned.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bookmark" size={12} color={accent} />
                  <Text style={[styles.sectionLabel, { color: subColor }]}>PINNED</Text>
                </View>
                {pinned.map(item => <FolderRow key={item.id} item={item} />)}
              </>
            )}

            {/* Folders */}
            {unpinned.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: subColor, marginLeft: 4, marginTop: 16 }]}>
                  FOLDERS
                </Text>
                {unpinned.map(item => <FolderRow key={item.id} item={item} />)}
              </>
            )}

            {loading && (
              <Text style={[styles.emptyText, { color: subColor, textAlign: 'center', marginTop: 40 }]}>
                Cargando...
              </Text>
            )}

            {!loading && filtered.length === 0 && search.length > 0 && (
              <View style={styles.empty}>
                <Ionicons name="folder-open-outline" size={52} color={accent} style={{ opacity: 0.35 }} />
                <Text style={[styles.emptyText, { color: subColor }]}>No folders found</Text>
              </View>
            )}
          </>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Nueva carpeta</Text>
            <TextInput
              style={[styles.modalInput, { color: textColor, borderColor: accent }]}
              placeholder="Nombre de la carpeta"
              placeholderTextColor={subColor}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
              onSubmitEditing={createFolder}
              returnKeyType="done"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: subColor }]}
                onPress={() => { setModalVisible(false); setNewFolderName('') }}
              >
                <Text style={[styles.modalBtnText, { color: subColor }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: accent, borderColor: accent }]}
                onPress={createFolder}
              >
                <Text style={[styles.modalBtnText, { color: '#111' }]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container:      { flex: 1 },
  header:         { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: 12, paddingHorizontal: 16 },
  headerTitle:    { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  iconBtn:        { padding: 6 },
  searchWrap:     { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8, marginBottom: 12 },
  searchInput:    { flex: 1, fontSize: 15, padding: 0 },
  sortRow:        { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 16 },
  sortBtn:        { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  sortBtnText:    { fontSize: 14, fontWeight: '600' },
  listContent:    { paddingHorizontal: 16, paddingBottom: 40 },
  allRow:         { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, gap: 10, marginBottom: 10 },
  allLabel:       { fontSize: 16, fontWeight: '600' },
  countText:      { fontSize: 14, minWidth: 28, textAlign: 'right' },
  newFolderCard:  { borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 10, marginBottom: 20 },
  plusCircle:     { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  newFolderLabel: { fontSize: 15, fontWeight: '500' },
  sectionHeader:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8, marginLeft: 4 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  folderRow:      { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, gap: 10, marginBottom: 8 },
  folderName:     { fontSize: 15, fontWeight: '500', flex: 1 },
  empty:          { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText:      { fontSize: 15 },
  overlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  modalCard:      { width: '100%', borderRadius: 16, padding: 24, gap: 16 },
  modalTitle:     { fontSize: 18, fontWeight: 'bold' },
  modalInput:     { borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  modalBtns:      { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  modalBtn:       { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  modalBtnText:   { fontWeight: '600', fontSize: 14 },
})