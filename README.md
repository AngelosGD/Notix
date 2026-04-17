# Notix 📝

App de notas y tareas — React Native con Expo

## Setup

1. Clona el repo
2. Instala dependencias: `npm install`
3. Corre el proyecto: `npx expo start`
4. Escanea el QR con la app Expo Go en tu cel

## Asignación de pantallas

| Pantalla        | Archivo                                      | Responsable        |
|-----------------|----------------------------------------------|--------------------|
| AddTask (modal) | `src/screens/AddTask/AddTaskModal.jsx`       | Mariana            |
| AddNote         | `src/screens/AddNote/AddNote.jsx`            | Estrella           |
| NoteForm        | `src/screens/NoteForm/NoteForm.jsx`          | Estrella + Mariana |
| MindMap         | `src/screens/MindMap/MindMap.jsx`            | Fer + Diosdado     |
| Folders         | `src/screens/Folders/Folders.jsx`            | Fernando           |
| Settings        | `src/screens/Settings/Settings.jsx`          | Diosdado           |

## Colores

Todos los colores están en `src/constants/colors.js` — úsalos para mantener consistencia visual.

## Navegación

El navigator está en `src/navigation/AppNavigator.jsx` — ya tiene todas las rutas registradas.
AddTask está configurado como modal (ventanita flotante) automáticamente.
