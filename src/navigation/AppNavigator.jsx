import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Notes from '../screens/Notes'
import Folders from '../screens/Folders'
import Settings from '../screens/Settings'
import AboutNotix from '../screens/AboutNotix'
import XiaomiCloud from '../screens/XiaomiCloud'
import XiaomiLogin from '../screens/XiaomiLogin'
import DeletedItems from '../screens/DeletedItems'
import AddNote from '../screens/AddNote'
import NoteForm from '../screens/NoteForm'
import MindMap from '../screens/MindMap'
import { AddTaskModal } from '../screens/AddTask'

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Notes" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Notes"        component={Notes} />
        <Stack.Screen name="Folders"      component={Folders} />
        <Stack.Screen name="Settings"     component={Settings} />
        <Stack.Screen name="AboutNotix"   component={AboutNotix} />
        <Stack.Screen name="XiaomiCloud"  component={XiaomiCloud} />
        <Stack.Screen name="XiaomiLogin"  component={XiaomiLogin} />
        <Stack.Screen name="DeletedItems" component={DeletedItems} />
        <Stack.Screen name="AddNote"      component={AddNote} />
        <Stack.Screen name="NoteForm"     component={NoteForm} />
        <Stack.Screen name="MindMap"      component={MindMap} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="AddTask" component={AddTaskModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}