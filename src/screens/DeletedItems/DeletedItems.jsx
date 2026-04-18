import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function DeletedItems({ navigation }) {
  const { bg, cardBg, textColor, subColor, accent } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { backgroundColor: bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Eliminados recientemente</Text>
      </View>

      <View style={styles.empty}>
        <Ionicons name="trash-outline" size={64} color={accent} style={{ opacity: 0.4 }} />
        <Text style={[styles.emptyTitle, { color: textColor }]}>Sin elementos eliminados</Text>
        <Text style={[styles.emptySubtitle, { color: subColor }]}>
          Los elementos eliminados se guardan aquí por 30 días antes de borrarse permanentemente.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:     { flex: 1 },
  header:        { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, gap: 8 },
  backBtn:       { padding: 4 },
  headerTitle:   { fontSize: 20, fontWeight: 'bold' },
  empty:         { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, gap: 12 },
  emptyTitle:    { fontSize: 18, fontWeight: '600' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
})