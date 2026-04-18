import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function AboutNotix({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre de Notix</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Logo / ícono */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="document-text" size={48} color="#fff" />
          </View>
          <Text style={styles.appName}>Notix</Text>
          <Text style={styles.version}>Versión 1.0.0</Text>
        </View>

        {/* Info */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Desarrollado por</Text>
            <Text style={styles.rowValue}>Equipo Notix</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Universidad</Text>
            <Text style={styles.rowValue}>Politecnica de penjamo</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Tecnología</Text>
            <Text style={styles.rowValue}>React Native + Expo</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Año</Text>
            <Text style={styles.rowValue}>2026</Text>
          </View>
        </View>

        {/* Equipo */}
        <Text style={styles.sectionLabel}>EQUIPO</Text>
        <View style={styles.card}>
          {['Angel', 'Mariana', 'Estrella', 'Fernando'].map((member, i, arr) => (
            <View key={i}>
              <View style={styles.memberRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{member[0]}</Text>
                </View>
                <Text style={styles.memberName}>{member}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Descripción */}
        <Text style={styles.sectionLabel}>DESCRIPCIÓN</Text>
        <View style={styles.card}>
          <Text style={styles.description}>
            Notix es una aplicación de notas y tareas desarrollada como proyecto de mantenimiento de software. Busca modernizar una app legacy con una interfaz limpia, intuitiva y funcional.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#111111' },
  header:      { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, gap: 8 },
  backBtn:     { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  content:     { paddingHorizontal: 16 },
  logoWrap:    { alignItems: 'center', paddingVertical: 32 },
  logoCircle:  { width: 90, height: 90, borderRadius: 22, backgroundColor: '#00C896', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  appName:     { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  version:     { fontSize: 14, color: '#666' },
  sectionLabel:{ fontSize: 11, fontWeight: '600', color: '#666', letterSpacing: 1, marginTop: 20, marginBottom: 8, marginLeft: 4 },
  card:        { backgroundColor: '#1e1e1e', borderRadius: 12, overflow: 'hidden' },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowLabel:    { fontSize: 15, color: '#fff' },
  rowValue:    { fontSize: 14, color: '#888' },
  divider:     { height: 1, backgroundColor: '#2a2a2a', marginLeft: 16 },
  memberRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  avatar:      { width: 34, height: 34, borderRadius: 17, backgroundColor: '#00C896', justifyContent: 'center', alignItems: 'center' },
  avatarText:  { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  memberName:  { color: '#fff', fontSize: 15 },
  description: { color: '#aaa', fontSize: 14, lineHeight: 22, padding: 16 },
})