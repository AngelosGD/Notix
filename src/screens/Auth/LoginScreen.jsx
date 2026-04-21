import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function LoginScreen({ navigation }) {
  const { signIn, signUp } = useAuth()
  const { accent, bg, cardBg, textColor, subColor, divColor } = useTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    if (!isLogin && !username) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario')
      return
    }

    setLoading(true)
    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password, username)

      if (error) {
        Alert.alert('Error', error.message)
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado')
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={bg} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Notix</Text>
        <Text style={[styles.subtitle, { color: subColor }]}>
          {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
        </Text>

        <View style={[styles.form, { backgroundColor: cardBg }]}>
          {!isLogin && (
            <TextInput
              style={[styles.input, { color: textColor, borderColor: divColor }]}
              placeholder="Nombre de usuario"
              placeholderTextColor={subColor}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}

          <TextInput
            style={[styles.input, { color: textColor, borderColor: divColor }]}
            placeholder="Correo electrónico"
            placeholderTextColor={subColor}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, { color: textColor, borderColor: divColor }]}
            placeholder="Contraseña"
            placeholderTextColor={subColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: accent }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={[styles.switchText, { color: accent }]}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 16,
  },
})