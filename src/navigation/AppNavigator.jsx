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
