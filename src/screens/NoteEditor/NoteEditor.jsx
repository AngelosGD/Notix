import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { useDatabase } from '../../context/DatabaseContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function NoteEditor({ navigation, route }) {
  const { accent, bg, cardBg, textColor, subColor, divColor } = useTheme()
  const insets = useSafeAreaInsets()
  const { updateNote } = useDatabase()

  const nota = route.params?.nota
  const [titulo, setTitulo] = useState(nota?.title || '')
  const [contenido, setContenido] = useState(nota?.content || '')
  const [guardando, setGuardando] = useState(false)

  const guardarNota = async () => {
    if (!titulo.trim()) {
      Alert.alert('Título requerido', 'Por favor escribe un título para la nota.')
      return
    }

    setGuardando(true)
    const success = await updateNote(nota.id, {
      title: titulo.trim(),
      content: contenido.trim(),
    })

    setGuardando(false)

    if (success) {
      Alert.alert('Éxito', 'Nota guardada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ])
    } else {
      Alert.alert('Error', 'No se pudo guardar la nota')
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Editar Nota</Text>
        <TouchableOpacity
          onPress={guardarNota}
          disabled={guardando}
          style={[styles.saveBtn, { backgroundColor: accent }]}
        >
          <Text style={styles.saveBtnText}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <TextInput
          style={[styles.inputTitulo, { color: textColor, borderColor: divColor }]}
          placeholder="Título de la nota..."
          placeholderTextColor={subColor}
          value={titulo}
          onChangeText={setTitulo}
          maxLength={100}
        />

        <TextInput
          style={[styles.inputContenido, { color: textColor, borderColor: divColor }]}
          placeholder="Escribe tu nota aquí..."
          placeholderTextColor={subColor}
          value={contenido}
          onChangeText={setContenido}
          multiline
          textAlignVertical="top"
          maxLength={2000}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  content: { flex: 1, paddingHorizontal: 20 },
  inputTitulo: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  inputContenido: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlignVertical: 'top',
  },
})