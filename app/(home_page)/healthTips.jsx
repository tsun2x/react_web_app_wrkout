import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'

const HealthTips = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const tips = [
    {
      number: 1,
      title: "Warm Up First",
      content: "Get your body ready! Spend 5–10 minutes doing light cardio or dynamic stretches before diving into your main workout."
    },
    {
      number: 2,
      title: "Focus on Form",
      content: "Perfect technique > heavy weights. Good form builds strength and prevents injuries."
    },
    {
      number: 3,
      title: "Progress Gradually",
      content: "Start small and increase intensity over time. Avoid overtraining early on — slow and steady wins the race."
    },
    {
      number: 4,
      title: "Mix It Up",
      content: "Combine cardio (for heart health) and strength training (for muscle tone and endurance)."
    },
    {
      number: 5,
      title: "Stay Hydrated",
      content: "Drink water before, during, and after workouts to keep your energy and performance levels up."
    },
    {
      number: 6,
      title: "Prioritize Rest Days",
      content: "Your muscles grow and recover during rest — not while overworking. Take at least one rest day per week."
    },
    {
      number: 7,
      title: "Listen to Your Body",
      content: "Pain or fatigue is your body's way of saying \"slow down.\" Train smart, not just hard."
    },
    {
      number: 8,
      title: "Track Your Progress",
      content: "Log your workouts, steps, or lifts. Seeing your improvement keeps motivation high."
    },
    {
      number: 9,
      title: "Find What You Enjoy",
      content: "Whether it's dancing, swimming, or lifting — doing what you love keeps you consistent."
    },
    {
      number: 10,
      title: "Cool Down & Stretch",
      content: "Wrap up every session with stretches to improve flexibility and reduce soreness."
    }
  ]



  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
            <Ionicons name="fitness" size={28} color="#34c759" />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText title style={styles.sectionTitle}>
              Health Tips for Exercise
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>Expert guidance for your fitness</ThemedText>
          </View>
        </View>

        {tips.map((tip) => (
          <View key={tip.number} style={styles.tipItem}>
            <Text style={[styles.tipNumber, { color: theme.title }]}>
              {tip.number}.
            </Text>
            <View style={styles.tipContent}>
              <ThemedText title style={styles.tipTitle}>
                {tip.title}
              </ThemedText>
              <ThemedText style={styles.tipText}>
                {tip.content}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  )
}

export default HealthTips

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tipNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 30,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
})
