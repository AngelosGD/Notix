import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function XiaomiLogin({ navigation }) {
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [accepted, setAccepted]       = useState(false)

  function handleLogin() {
    if (!accepted) {
      Alert.alert('Aviso', 'Debes aceptar el Acuerdo de Usuario y la Política de Privacidad.')
      return
    }
    if (!email || !password) {
      Alert.alert('Aviso', 'Por favor ingresa tu correo y contraseña.')
      return
    }
    Alert.alert('Notix', 'La integración con Xiaomi Cloud aún no está disponible en esta versión.')
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuenta Mi - Iniciar sesión</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Lang + Ayuda */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.langBtn}>
            <Text style={styles.langText}>Español (América)</Text>
            <Ionicons name="chevron-down" size={14} color="#aaa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ayudaBtn}>
            <Ionicons name="shield-outline" size={16} color="#aaa" />
            <Text style={styles.langText}>Ayuda</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Inicie sesión con su Cuenta Mi</Text>

        {/* Logo MI */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>MI</Text>
          </View>
        </View>

        <Text style={styles.tagline}>Cree siempre que algo maravilloso está a punto de ocurrir</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Correo/Teléfono/Cuenta Mi"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Introduzca su contraseña"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Checkbox términos */}
        <TouchableOpacity style={styles.checkRow} onPress={() => setAccepted(v => !v)}>
          <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
            {accepted && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
          <Text style={styles.checkText}>
            He leído y acepto el{' '}
            <Text style={styles.link}>Acuerdo de Usuario de Cuenta Mi</Text>
            {' '}y la{' '}
            <Text style={styles.link}>Política de Privacidad de Cuenta Mi</Text>
          </Text>
        </TouchableOpacity>

        {/* Botón iniciar sesión */}
        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
          <Text style={styles.btnLoginText}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Botón Google */}
        <TouchableOpacity style={styles.btnGoogle} onPress={() => Alert.alert('Notix', 'Inicio con Google no disponible en esta versión.')}>
          <View style={styles.googleIcon}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={styles.btnGoogleText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>

        {/* Links inferiores */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity><Text style={styles.bottomLink}>Crear cuenta</Text></TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity><Text style={styles.bottomLink}>¿Olvidó la contraseña?</Text></TouchableOpacity>
        </View>

        {/* Más opciones */}
        <View style={styles.moreWrap}>
          <View style={styles.line} />
          <Text style={styles.moreText}>Más opciones</Text>
          <View style={styles.line} />
        </View>

        {/* Facebook */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.facebookBtn}
            onPress={() => Alert.alert('Notix', 'Inicio con Facebook no disponible en esta versión.')}
          >
            <Text style={styles.facebookF}>f</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#111111' },
  header:        { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  headerTitle:   { color: '#fff', fontSize: 18, fontWeight: '600' },
  content:       { paddingHorizontal: 20 },
  topBar:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  langBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ayudaBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  langText:      { color: '#aaa', fontSize: 13 },
  title:         { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  logoWrap:      { alignItems: 'center', marginBottom: 16 },
  logoCircle:    { width: 72, height: 72, borderRadius: 18, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center' },
  logoText:      { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  tagline:       { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  input:         { backgroundColor: '#2a2a2a', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 15, marginBottom: 12 },
  passwordWrap:  { backgroundColor: '#2a2a2a', borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, color: '#fff', fontSize: 15 },
  eyeBtn:        { padding: 14 },
  checkRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  checkbox:      { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#555', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxOn:    { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  checkText:     { flex: 1, color: '#aaa', fontSize: 13, lineHeight: 19 },
  link:          { color: '#4A90E2' },
  btnLogin:      { backgroundColor: '#2a4a7a', borderRadius: 30, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
  btnLoginText:  { color: '#aaa', fontSize: 16, fontWeight: '600' },
  btnGoogle:     { backgroundColor: '#4A90E2', borderRadius: 30, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 },
  googleIcon:    { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  googleG:       { color: '#4A90E2', fontWeight: 'bold', fontSize: 16 },
  btnGoogleText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bottomLinks:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 24 },
  bottomLink:    { color: '#aaa', fontSize: 14 },
  separator:     { color: '#555' },
  moreWrap:      { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  line:          { flex: 1, height: 1, backgroundColor: '#333' },
  moreText:      { color: '#888', fontSize: 13 },
  socialRow:     { alignItems: 'center' },
  facebookBtn:   { width: 46, height: 46, borderRadius: 23, backgroundColor: '#3b5998', justifyContent: 'center', alignItems: 'center' },
  facebookF:     { color: '#fff', fontSize: 22, fontWeight: 'bold' },
})