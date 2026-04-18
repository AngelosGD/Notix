import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, Modal, Alert
} from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, ACCENT_COLORS } from '../../context/ThemeContext'

const FONT_SIZE_OPTIONS = ['Pequeña', 'Mediana', 'Grande', 'Muy grande']
const ORDER_OPTIONS     = ['Por fecha de modificación', 'Por fecha de creación', 'Por título (A-Z)', 'Por título (Z-A)']
const DESIGN_OPTIONS    = ['Ver en cuadrícula', 'Ver en lista']

export default function Settings({ navigation }) {
  const theme = useTheme()

  // Estado local para los cambios (no se aplican globalmente hasta guardar)
  const [localDarkMode, setLocalDarkMode]           = useState(theme.darkMode)
  const [localAccent, setLocalAccent]               = useState(theme.selectedAccent)
  const [highPriority, setHighPriority]             = useState(false)
  const [fontSize, setFontSize]                     = useState('Mediana')
  const [order, setOrder]                           = useState('Por fecha de modificación')
  const [design, setDesign]                         = useState('Ver en cuadrícula')
  const [dropdownModal, setDropdownModal]           = useState({ visible: false, title: '', options: [], current: '', onSelect: null })
  const [quickNoteModal, setQuickNoteModal]         = useState(false)

  // Detectar si hay cambios sin guardar
  const hasChanges = localDarkMode !== theme.darkMode || localAccent !== theme.selectedAccent

  // Interceptar el botón de regresar si hay cambios
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasChanges) return
      e.preventDefault()
      Alert.alert(
        'Cambios sin guardar',
        '¿Deseas guardar los cambios antes de salir?',
        [
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Guardar',
            onPress: () => {
              theme.setDarkMode(localDarkMode)
              theme.setSelectedAccent(localAccent)
              navigation.dispatch(e.data.action)
            },
          },
        ]
      )
    })
    return unsubscribe
  }, [navigation, hasChanges, localDarkMode, localAccent])

  function saveChanges() {
    theme.setDarkMode(localDarkMode)
    theme.setSelectedAccent(localAccent)
    Alert.alert('✓ Guardado', 'Tus cambios han sido guardados.')
  }

  function openDropdown(title, options, current, onSelect) {
    setDropdownModal({ visible: true, title, options, current, onSelect })
  }

  // Colores locales (preview antes de guardar)
  const accent     = ACCENT_COLORS[localAccent]
  const bg         = localDarkMode ? '#111111' : '#F2F2F7'
  const cardBg     = localDarkMode ? '#1e1e1e' : '#FFFFFF'
  const textColor  = localDarkMode ? '#FFFFFF' : '#000000'
  const subColor   = localDarkMode ? '#888888' : '#666666'
  const divColor   = localDarkMode ? '#2a2a2a' : '#E5E5EA'
  const labelColor = localDarkMode ? '#666666' : '#999999'

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={localDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Configuración</Text>
        {hasChanges && (
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: accent }]} onPress={saveChanges}>
            <Text style={styles.saveBtnText}>Guardar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* SERVICIOS DE LA NUBE */}
        <Text style={[styles.sectionLabel, { color: labelColor }]}>SERVICIOS DE LA NUBE</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('XiaomiCloud')}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowTitle, { color: textColor }]}>Xiaomi Cloud</Text>
              <Text style={[styles.rowSubtitle, { color: accent }]}>
                Active la sincronización para notas, tareas y más
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={subColor} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: divColor }]} />
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('DeletedItems')}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Elementos eliminados recientemente</Text>
            <Ionicons name="chevron-forward" size={18} color={subColor} />
          </TouchableOpacity>
        </View>

        {/* ESTILO */}
        <Text style={[styles.sectionLabel, { color: labelColor }]}>ESTILO</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={() => openDropdown('Tamaño de fuente', FONT_SIZE_OPTIONS, fontSize, setFontSize)}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Tamaño de fuente</Text>
            <View style={styles.rowValueWrap}>
              <Text style={[styles.rowValue, { color: subColor }]}>{fontSize}</Text>
              <Ionicons name="chevron-down" size={14} color={subColor} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: divColor }]} />
          <TouchableOpacity style={styles.row} onPress={() => openDropdown('Ordenar', ORDER_OPTIONS, order, setOrder)}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Ordenar</Text>
            <View style={styles.rowValueWrap}>
              <Text style={[styles.rowValue, { color: subColor }]}>{order}</Text>
              <Ionicons name="chevron-down" size={14} color={subColor} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: divColor }]} />
          <TouchableOpacity style={styles.row} onPress={() => openDropdown('Diseño', DESIGN_OPTIONS, design, setDesign)}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Diseño</Text>
            <View style={styles.rowValueWrap}>
              <Text style={[styles.rowValue, { color: subColor }]}>{design}</Text>
              <Ionicons name="chevron-down" size={14} color={subColor} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* TEMA Y APARIENCIA */}
        <View style={styles.sectionLabelRow}>
          <Text style={[styles.sectionLabel, { color: labelColor, marginTop: 0 }]}>TEMA Y APARIENCIA</Text>
          <View style={[styles.newBadge, { backgroundColor: accent }]}>
            <Text style={styles.newBadgeText}>+ NUEVO</Text>
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Modo oscuro / claro</Text>
            <Switch
              value={localDarkMode}
              onValueChange={setLocalDarkMode}
              trackColor={{ false: '#ccc', true: accent }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: divColor }]} />
          <View style={[styles.row, { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }]}>
            <View>
              <Text style={[styles.rowTitle, { color: textColor }]}>Color de acento</Text>
              <Text style={[styles.rowSubtitle, { color: accent }]}>Elige el color principal de la interfaz</Text>
            </View>
            <View style={styles.accentRow}>
              {ACCENT_COLORS.map((color, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setLocalAccent(i)}
                  style={[styles.accentCircle, { backgroundColor: color }, localAccent === i && styles.accentCircleSelected]}
                >
                  {localAccent === i && <Ionicons name="checkmark" size={14} color="#fff" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: divColor }]} />
          <TouchableOpacity style={styles.row}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Personalizar tema</Text>
            <Ionicons name="chevron-forward" size={18} color={subColor} />
          </TouchableOpacity>
        </View>

        {/* FUNCIONES RÁPIDAS */}
        <Text style={[styles.sectionLabel, { color: labelColor }]}>FUNCIONES RÁPIDAS</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={() => setQuickNoteModal(true)}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Notas rápidas</Text>
            <Ionicons name="chevron-forward" size={18} color={subColor} />
          </TouchableOpacity>
        </View>

        {/* RECORDATORIOS */}
        <Text style={[styles.sectionLabel, { color: labelColor }]}>RECORDATORIOS</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowTitle, { color: textColor }]}>Recordatorios de alta prioridad</Text>
              <Text style={[styles.rowSubtitle, { color: accent }]}>Reproducir sonido incluso en Modo silencio</Text>
            </View>
            <Switch
              value={highPriority}
              onValueChange={setHighPriority}
              trackColor={{ false: '#444', true: accent }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* OTROS */}
        <Text style={[styles.sectionLabel, { color: labelColor }]}>OTROS</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('AboutNotix')}>
            <Text style={[styles.rowTitle, { color: textColor }]}>Acerca de Notix</Text>
            <Ionicons name="chevron-forward" size={18} color={subColor} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL DROPDOWN */}
      <Modal transparent animationType="fade" visible={dropdownModal.visible} onRequestClose={() => setDropdownModal(d => ({ ...d, visible: false }))}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDropdownModal(d => ({ ...d, visible: false }))}>
          <View style={[styles.dropdownBox, { backgroundColor: cardBg }]}>
            <Text style={[styles.dropdownTitle, { color: subColor }]}>{dropdownModal.title}</Text>
            {dropdownModal.options?.map((opt, i) => (
              <TouchableOpacity key={i} style={styles.dropdownOption} onPress={() => { dropdownModal.onSelect(opt); setDropdownModal(d => ({ ...d, visible: false })) }}>
                <Text style={[styles.dropdownOptionText, { color: textColor }]}>{opt}</Text>
                {dropdownModal.current === opt && <Ionicons name="checkmark" size={18} color={accent} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL NOTAS RÁPIDAS */}
      <Modal transparent animationType="fade" visible={quickNoteModal} onRequestClose={() => setQuickNoteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.alertBox, { backgroundColor: cardBg }]}>
            <Ionicons name="flash-outline" size={36} color={accent} style={{ marginBottom: 10 }} />
            <Text style={[styles.alertTitle, { color: textColor }]}>Notas rápidas</Text>
            <Text style={[styles.alertMessage, { color: subColor }]}>
              ¿Deseas activar las notas rápidas? Esta función te permitirá crear notas desde cualquier parte del sistema.
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={[styles.alertBtn, styles.alertBtnCancel, { borderColor: divColor }]} onPress={() => setQuickNoteModal(false)}>
                <Text style={[styles.alertBtnText, { color: subColor }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.alertBtn, { backgroundColor: accent }]} onPress={() => setQuickNoteModal(false)}>
                <Text style={[styles.alertBtnText, { color: '#fff' }]}>Activar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container:            { flex: 1 },
  header:               { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, gap: 8 },
  backBtn:              { padding: 4 },
  headerTitle:          { fontSize: 22, fontWeight: 'bold', flex: 1 },
  saveBtn:              { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  saveBtnText:          { color: '#fff', fontWeight: '600', fontSize: 14 },
  scroll:               { flex: 1, paddingHorizontal: 16 },
  sectionLabel:         { fontSize: 11, fontWeight: '600', letterSpacing: 1, marginTop: 20, marginBottom: 8, marginLeft: 4 },
  sectionLabelRow:      { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 8, marginLeft: 4, gap: 8 },
  newBadge:             { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  newBadgeText:         { color: '#fff', fontSize: 10, fontWeight: '700' },
  card:                 { borderRadius: 12, overflow: 'hidden' },
  row:                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowLeft:              { flex: 1, paddingRight: 12 },
  rowTitle:             { fontSize: 15 },
  rowSubtitle:          { fontSize: 12, marginTop: 2 },
  rowValue:             { fontSize: 13 },
  rowValueWrap:         { flexDirection: 'row', alignItems: 'center' },
  divider:              { height: 1, marginLeft: 16 },
  accentRow:            { flexDirection: 'row', gap: 12 },
  accentCircle:         { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  accentCircleSelected: { borderWidth: 2.5, borderColor: '#fff' },
  modalOverlay:         { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dropdownBox:          { width: '100%', borderRadius: 16, paddingVertical: 8 },
  dropdownTitle:        { fontSize: 13, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 10 },
  dropdownOption:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  dropdownOptionText:   { fontSize: 15 },
  alertBox:             { width: '100%', borderRadius: 16, padding: 24, alignItems: 'center' },
  alertTitle:           { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  alertMessage:         { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  alertButtons:         { flexDirection: 'row', gap: 12, width: '100%' },
  alertBtn:             { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  alertBtnCancel:       { borderWidth: 1 },
  alertBtnText:         { fontSize: 15, fontWeight: '600' },
})