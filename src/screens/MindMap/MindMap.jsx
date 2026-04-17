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
