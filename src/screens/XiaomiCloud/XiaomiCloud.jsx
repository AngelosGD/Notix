import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const FEATURES = [
  {
    icon: 'grid',
    color: '#FF6B35',
    title: 'Sincronizar datos de la aplicación',
    desc: 'Sincronice sus contactos, mensajes, notas, calendario y más',
  },
  {
    icon: 'home',
    color: '#00C896',
    title: 'Respaldar diseño de la pantalla de inicio',
    desc: 'Respaldar aplicaciones, diseño de la pantalla de inicio y fondo de pantalla',
  },
  {
    icon: 'settings',
    color: '#888',
    title: 'Respaldar los ajustes del sistema',
    desc: 'Respalde las configuraciones importantes, incluidas la conexión Wi-Fi y la pantalla',
  },
  {
    icon: 'phone-portrait',
    color: '#4A90E2',
    title: 'Encontrar dispositivo',
    desc: 'Bloquee su dispositivo de manera remota en caso de pérdida',
  },
]

export default function XiaomiCloud({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Xiaomi Cloud</Text>
        <Text style={styles.subtitle}>Todos los elementos importantes en un solo lugar</Text>

        {/* Features card */}
        <View style={styles.card}>
          {FEATURES.map((f, i) => (
            <View key={i}>
              <View style={styles.featureRow}>
                <View style={[styles.iconWrap, { backgroundColor: f.color + '22' }]}>
                  <Ionicons name={f.icon} size={22} color={f.color} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
              {i < FEATURES.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomWrap}>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('XiaomiLogin')}
        >
          <Text style={styles.loginBtnText}>Inicie sesión para usar Xiaomi Cloud</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#111111' },
  header:       { paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn:      { padding: 4, alignSelf: 'flex-start' },
  content:      { paddingHorizontal: 16, paddingBottom: 100 },
  title:        { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 8, marginBottom: 6 },
  subtitle:     { fontSize: 14, color: '#888', marginBottom: 24 },
  card:         { backgroundColor: '#1e1e1e', borderRadius: 14, overflow: 'hidden' },
  featureRow:   { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 14 },
  iconWrap:     { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  featureText:  { flex: 1 },
  featureTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  featureDesc:  { color: '#888', fontSize: 13, lineHeight: 18 },
  divider:      { height: 1, backgroundColor: '#2a2a2a', marginLeft: 16 },
  bottomWrap:   { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#111111' },
  loginBtn:     { backgroundColor: '#4A90E2', borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})