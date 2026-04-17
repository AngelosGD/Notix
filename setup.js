const fs = require('fs')
const path = require('path')

// ─── Utilidades ───────────────────────────────────────────────
function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function write(filePath, content) {
  mkdirp(path.dirname(filePath))
  fs.writeFileSync(filePath, content.trimStart(), 'utf8')
  console.log('  creado →', filePath)
}

// ─── Constantes ───────────────────────────────────────────────
write('src/constants/colors.js', `
export const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#333333',
  textLight: '#888888',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
}
`)

write('src/constants/typography.js', `
export const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' },
  h2: { fontSize: 22, fontWeight: 'bold' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 14 },
  caption: { fontSize: 12 },
}
`)

// ─── Screens ──────────────────────────────────────────────────
const screens = [
  {
    folder: 'AddTask',
    files: [
      {
        name: 'AddTask.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function AddTask() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AddTask — Mariana</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      {
        name: 'AddTaskModal.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function AddTaskModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AddTaskModal — Mariana</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      {
        name: 'index.js',
        content: `
export { default } from './AddTask'
export { default as AddTaskModal } from './AddTaskModal'
`,
      },
    ],
  },
  {
    folder: 'AddNote',
    files: [
      {
        name: 'AddNote.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function AddNote() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AddNote — Estrella</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      { name: 'index.js', content: `export { default } from './AddNote'\n` },
    ],
  },
  {
    folder: 'NoteForm',
    files: [
      {
        name: 'NoteForm.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function NoteForm() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>NoteForm — Estrella + Mariana</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      { name: 'index.js', content: `export { default } from './NoteForm'\n` },
    ],
  },
  {
    folder: 'MindMap',
    files: [
      {
        name: 'MindMap.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function MindMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MindMap — Fer + Diosdado</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      { name: 'index.js', content: `export { default } from './MindMap'\n` },
    ],
  },
  {
    folder: 'Folders',
    files: [
      {
        name: 'Folders.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function Folders() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Folders — Fernando</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      { name: 'index.js', content: `export { default } from './Folders'\n` },
    ],
  },
  {
    folder: 'Settings',
    files: [
      {
        name: 'Settings.jsx',
        content: `
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings — Diosdado</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text },
})
`,
      },
      { name: 'index.js', content: `export { default } from './Settings'\n` },
    ],
  },
]

screens.forEach(({ folder, files }) => {
  files.forEach(({ name, content }) => {
    write(`src/screens/${folder}/${name}`, content)
  })
})

// ─── Carpetas extra vacías ─────────────────────────────────────
mkdirp('src/components')
mkdirp('src/assets/icons')
mkdirp('src/assets/images')
console.log('  creado → src/components/')
console.log('  creado → src/assets/icons/')
console.log('  creado → src/assets/images/')

// ─── Navigator ────────────────────────────────────────────────
write('src/navigation/AppNavigator.jsx', `
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Folders from '../screens/Folders'
import Settings from '../screens/Settings'
import AddNote from '../screens/AddNote'
import NoteForm from '../screens/NoteForm'
import MindMap from '../screens/MindMap'
import { AddTaskModal } from '../screens/AddTask'

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Folders">

        {/* Pantallas normales */}
        <Stack.Screen name="Folders" component={Folders} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="AddNote" component={AddNote} />
        <Stack.Screen name="NoteForm" component={NoteForm} />
        <Stack.Screen name="MindMap" component={MindMap} />

        {/* Modal — la ventanita de AddTask */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="AddTask" component={AddTaskModal} />
        </Stack.Group>

      </Stack.Navigator>
    </NavigationContainer>
  )
}
`)

// ─── App.jsx ──────────────────────────────────────────────────
write('App.jsx', `
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return <AppNavigator />
}
`)

// ─── README ───────────────────────────────────────────────────
write('README.md', `
# Notix 📝

App de notas y tareas — React Native con Expo

## Setup

1. Clona el repo
2. Instala dependencias: \`npm install\`
3. Corre el proyecto: \`npx expo start\`
4. Escanea el QR con la app Expo Go en tu cel

## Asignación de pantallas

| Pantalla        | Archivo                                      | Responsable        |
|-----------------|----------------------------------------------|--------------------|
| AddTask (modal) | \`src/screens/AddTask/AddTaskModal.jsx\`       | Mariana            |
| AddNote         | \`src/screens/AddNote/AddNote.jsx\`            | Estrella           |
| NoteForm        | \`src/screens/NoteForm/NoteForm.jsx\`          | Estrella + Mariana |
| MindMap         | \`src/screens/MindMap/MindMap.jsx\`            | Fer + Diosdado     |
| Folders         | \`src/screens/Folders/Folders.jsx\`            | Fernando           |
| Settings        | \`src/screens/Settings/Settings.jsx\`          | Diosdado           |

## Colores

Todos los colores están en \`src/constants/colors.js\` — úsalos para mantener consistencia visual.

## Navegación

El navigator está en \`src/navigation/AppNavigator.jsx\` — ya tiene todas las rutas registradas.
AddTask está configurado como modal (ventanita flotante) automáticamente.
`)

// ─── Listo ────────────────────────────────────────────────────
console.log('\n✅ Estructura creada exitosamente!')
console.log('👉 Siguiente paso: npx expo start\n')