import { StyleSheet, TextInput, Text, Button } from 'react-native'
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import { useState } from 'react'

const Profile = () => {
  const [text, setText] = useState('');

  return (
   <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        Your Username
      </ThemedText>

      <TextInput
        style={styles.input}
        onChangeText={newText => setText(newText)}
        value={text}
        placeholder="Enter your username to save locally"
      />

      <Button
        title="Update Username"
        onPress={() => setText(text)}
      />
      <Spacer />
      <Text>Your username is: {text}</Text>
      
      <Spacer />
      
      <ThemedText>Start workout</ThemedText>
      <Spacer />

    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
})