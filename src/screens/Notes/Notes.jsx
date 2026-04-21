import { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { useDatabase } from '../../context/DatabaseContext'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AddNote({ navigation }) {
  const { accent, bg, cardBg, textColor, subColor, divColor } = useTheme()
  const insets = useSafeAreaInsets()
  const { notes, createNote, deleteNote, loading } = useDatabase()

  const [busqueda,     setBusqueda]     = useState('')
  const [filtroActivo, setFiltroActivo] = useState('este_mes')
  const [modalVisible, setModalVisible] = useState(false)

  // ── Estados del formulario dentro del modal ─────────────────────────────────
  const [nuevoTitulo,    setNuevoTitulo]    = useState('')
  const [nuevoContenido, setNuevoContenido] = useState('')

  // ── Preparar notas para mostrar ────────────────────────────────────────────
  const notasFormateadas = notes.map(note => ({
    id: note.id,
    titulo: note.title || 'Sin título',
    fecha: new Date(note.created_at).getMonth() === new Date().getMonth() ? 'este_mes' : 'mes_pasado',
    content: note.content,
    type: note.type || 'note',
  }))

  const notasFiltradas = notasFormateadas.filter(n => {
    const coincideFiltro   = n.fecha === filtroActivo
    const coincideBusqueda = n.titulo.toLowerCase().includes(busqueda.toLowerCase())
    return coincideFiltro && coincideBusqueda
  })

  // ── Crear nota nueva ────────────────────────────────────────────────────────
  const crearNota = async () => {
    if (!nuevoTitulo.trim()) {
      Alert.alert('Título requerido', 'Por favor escribe un título para la nota.')
      return
    }

    const nuevaNota = {
      title: nuevoTitulo.trim(),
      content: nuevoContenido.trim(),
      type: 'note',
    }

    const result = await createNote(nuevaNota)
    if (result) {
      setNuevoTitulo('')
      setNuevoContenido('')
      setModalVisible(false)
      Alert.alert('Éxito', 'Nota creada correctamente')
    } else {
      Alert.alert('Error', 'No se pudo crear la nota')
    }
  }

  // ── Crear mapa mental ───────────────────────────────────────────────────────
  const crearMapaMental = async () => {
    if (!nuevoTitulo.trim()) {
      Alert.alert('Título requerido', 'Por favor escribe un título para el mapa mental.')
      return
    }

    const nuevaNota = {
      title: nuevoTitulo.trim(),
      content: nuevoContenido.trim(),
      type: 'mindmap',
    }

    const result = await createNote(nuevaNota)
    if (result) {
      setNuevoTitulo('')
      setNuevoContenido('')
      setModalVisible(false)
      // Navegar a MindMap con la nota creada
      navigation.navigate('MindMap', { nota: result })
    } else {
      Alert.alert('Error', 'No se pudo crear el mapa mental')
    }
  }

  const eliminarNota = async (id) => {
    Alert.alert(
      'Eliminar nota',
      '¿Seguro que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteNote(id)
            if (success) {
              Alert.alert('Éxito', 'Nota eliminada correctamente')
            } else {
              Alert.alert('Error', 'No se pudo eliminar la nota')
            }
          },
        },
      ]
    )
  }

  const masOpciones = (nota) => {
    Alert.alert(nota.titulo, 'Más opciones', [
      { text: 'Editar',      onPress: () => navigation.navigate('NoteForm', { nota }) },
      { text: 'Mapa mental', onPress: () => navigation.navigate('MindMap',  { nota }) },
      { text: 'Cancelar',    style: 'cancel' },
    ])
  }

  const renderNota = ({ item }) => (
    <TouchableOpacity
      style={[styles.notaCard, { backgroundColor: cardBg }]}
      onPress={() => {
        if (item.type === 'mindmap') {
          navigation.navigate('MindMap', { nota: item })
        } else {
          navigation.navigate('NoteEditor', { nota: item })
        }
      }}
      activeOpacity={0.75}
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <Text style={[styles.notaTitulo, { color: textColor }]} numberOfLines={1}>
        {item.titulo}
      </Text>
      <View style={styles.notaAcciones}>
        <TouchableOpacity onPress={() => eliminarNota(item.id)} style={styles.accionBtn}>
          <Ionicons name="trash-outline" size={20} color={subColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => masOpciones(item)} style={styles.accionBtn}>
          <Ionicons name="menu-outline" size={22} color={subColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Folders')}>
          <Ionicons name="folder-outline" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Agrega Nota</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={[styles.searchBox, { backgroundColor: cardBg, borderColor: accent }]}>
        <Ionicons name="search-outline" size={18} color={subColor} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Buscar nota..."
          placeholderTextColor={subColor}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={subColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filtros}>
        {[
          { key: 'este_mes',   label: 'Este mes'   },
          { key: 'mes_pasado', label: 'Mes pasado' },
        ].map(f => {
          const activo = filtroActivo === f.key
          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filtroBtn,
                { borderColor: accent },
                activo && { backgroundColor: accent },
              ]}
              onPress={() => setFiltroActivo(f.key)}
            >
              <Text style={[styles.filtroLabel, { color: activo ? '#fff' : textColor }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={[styles.lineaSep, { backgroundColor: divColor }]} />

      {/* Lista */}
      <FlatList
        data={notasFiltradas}
        keyExtractor={item => item.id}
        renderItem={renderNota}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => (
          <View style={[styles.separador, { backgroundColor: divColor }]} />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="document-text-outline" size={48} color={subColor} />
            <Text style={[styles.vacioText, { color: subColor }]}>
              {busqueda ? 'Sin resultados' : 'No hay notas aquí todavía'}
            </Text>
          </View>
        }
      />

      {/* FAB — ahora abre el modal, ya no navega */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: accent, bottom: 76 + insets.bottom }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: cardBg, borderTopColor: divColor, bottom: insets.bottom }]}>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabLabel, { color: accent }]}>Notas</Text>
          <View style={[styles.tabIndicador, { backgroundColor: accent }]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('AddTask')}>
          <Text style={[styles.tabLabel, { color: subColor }]}>Tareas</Text>
        </TouchableOpacity>
      </View>

      {/* ── Modal crear nota ────────────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalCard, { backgroundColor: cardBg }]}>

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { color: textColor }]}>Nueva Nota</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={subColor} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.inputTitulo, { backgroundColor: bg, borderColor: divColor, color: textColor }]}
              placeholder="Título de la nota..."
              placeholderTextColor={subColor}
              value={nuevoTitulo}
              onChangeText={setNuevoTitulo}
              maxLength={80}
              autoFocus
            />

            <TextInput
              style={[styles.inputContenido, { backgroundColor: bg, borderColor: divColor, color: textColor }]}
              placeholder="Escribe tu nota aquí..."
              placeholderTextColor={subColor}
              value={nuevoContenido}
              onChangeText={setNuevoContenido}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.btnCancelar, { borderColor: divColor }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.btnCancelarText, { color: subColor }]}>Cancelar</Text>
              </TouchableOpacity>
              <View style={styles.crearBtns}>
                <TouchableOpacity
                  style={[styles.btnMapaMental, { backgroundColor: '#7C63FF' }]}
                  onPress={crearMapaMental}
                >
                  <Ionicons name="git-network-outline" size={16} color="#fff" />
                  <Text style={styles.btnMapaMentalText}>Mapa Mental</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnCrear, { backgroundColor: accent }]}
                  onPress={crearNota}
                >
                  <Text style={styles.btnCrearText}>Crear nota</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12, paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },

  filtros: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, gap: 10 },
  filtroBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, alignItems: 'center' },
  filtroLabel: { fontSize: 14, fontWeight: '600' },

  lineaSep: { height: 1, marginHorizontal: 20, marginBottom: 4 },

  lista: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 120 },
  separador: { height: 1 },

  notaCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingRight: 8 },
  accentBar: { width: 3, height: 34, borderRadius: 2, marginRight: 14 },
  notaTitulo: { flex: 1, fontSize: 15, fontWeight: '600' },
  notaAcciones: { flexDirection: 'row', gap: 4, marginLeft: 8 },
  accionBtn: { padding: 6 },

  vacio: { alignItems: 'center', paddingTop: 64, gap: 12 },
  vacioText: { fontSize: 15 },

  fab: {
    position: 'absolute', right: 24,
    width: 58, height: 58, borderRadius: 29,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, zIndex: 1001,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },

  tabBar: {
    flexDirection: 'row', position: 'absolute',
    left: 0, right: 0, height: 64,
    borderTopWidth: 1, zIndex: 1000,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 15, fontWeight: '600' },
  tabIndicador: { position: 'absolute', bottom: 0, height: 2, width: '40%', borderRadius: 2 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitulo: { fontSize: 20, fontWeight: '700' },

  inputTitulo: {
    borderRadius: 12, borderWidth: 1,
    fontSize: 16, fontWeight: '600',
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12,
  },
  inputContenido: {
    borderRadius: 12, borderWidth: 1,
    fontSize: 14, paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 20, height: 120,
  },

  modalBtns: { flexDirection: 'row', gap: 12 },
  btnCancelar: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1 },
  btnCancelarText: { fontSize: 15, fontWeight: '600' },
  crearBtns: { flex: 1, flexDirection: 'row', gap: 8 },
  btnMapaMental: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', flexDirection: 'row', gap: 6 },
  btnMapaMentalText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnCrear: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  btnCrearText: { color: '#fff', fontSize: 15, fontWeight: '700' },
})