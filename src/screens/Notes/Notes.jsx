import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function Notes({ navigation }) {
  const { accent, bg, textColor } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={bg === '#111111' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: bg }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Notas</Text>
        <View style={styles.headerIcons}>
          
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      

      
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn:     { padding: 8, borderRadius: 8 },
  emptyState:  { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText:   { fontSize: 16 },
  fab:         { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
})