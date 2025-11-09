import { StyleSheet, ScrollView, Text } from 'react-native'
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import Spacer from "../../components/Spacer"

const Info = () => {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <ThemedText title={true} style={styles.heading}>
          About the App
        </ThemedText>
        <Text style={styles.paragraph}>
          <Text style={styles.appName}>FitLife</Text> is a full-featured fitness companion designed 
          to help you plan, track, and achieve your workout goals. Whether you’re a beginner or 
          an experienced athlete, the app assists you in creating structured workout plans, 
          monitoring your progress, and staying motivated through personalized routines and 
          visual tracking. and for the passing of our mini-project from appdev.
        </Text>

        <Spacer />

        <ThemedText title={true} style={styles.heading}>
          About the Developers
        </ThemedText>
        <Text style={styles.paragraph}>
          Mark Osumo — Developer{'\n'}
          Errn Natividad — Developer{'\n'}
          Claire Tuble — Team Leader{'\n'}
          Terrence Bernabe — Developer{'\n'}
          Mitzie Rammos — Developer
        </Text>

        <Spacer />

        <ThemedText title={true} style={styles.heading}>
          Purpose
        </ThemedText>
        <Text style={styles.paragraph}>
          This app was created to provide an accessible and interactive way to improve fitness 
          routines. It empowers users to stay consistent, understand their progress, and 
          maintain motivation throughout their fitness journey.
        </Text>

      </ScrollView>
    </ThemedView>
  )
}

export default Info

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  appName: {
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
})
