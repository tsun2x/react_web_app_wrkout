import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'

const NutritionAdvice = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const advice = [
    {
      number: 1,
      title: "Eat Balanced Meals",
      content: "Every plate should have lean protein, complex carbs, and healthy fats to fuel performance."
    },
    {
      number: 2,
      title: "Choose Whole Foods",
      content: "Pick natural, nutrient-rich options — fruits, veggies, whole grains, and lean meats."
    },
    {
      number: 3,
      title: "Pre-Workout Fuel",
      content: "Eat a light meal or snack 1–2 hours before training. Try oatmeal with fruit or a banana with peanut butter."
    },
    {
      number: 4,
      title: "Post-Workout Recovery",
      content: "Refuel within 30–60 minutes after exercise with protein and carbs — like a shake or chicken with rice."
    },
    {
      number: 5,
      title: "Hydrate All Day",
      content: "Water helps with energy, digestion, and recovery. Aim for 8–10 glasses daily (more if you sweat a lot)."
    },
    {
      number: 6,
      title: "Don't Skip Meals",
      content: "Stay consistent with meals to support metabolism and workout performance."
    },
    {
      number: 7,
      title: "Get Your Micros",
      content: "Vitamins and minerals like iron, magnesium, and vitamin D help maintain strength and recovery."
    },
    {
      number: 8,
      title: "Watch Your Portions",
      content: "Control portions to match your energy output — balance is key."
    },
    {
      number: 9,
      title: "Limit Sugar & Junk Food",
      content: "Reduce processed foods and sugary drinks that cause energy crashes."
    },
    {
      number: 10,
      title: "Plan Ahead",
      content: "Meal prep on weekends or nights before. It keeps your nutrition goals on track and saves time."
    }
  ]

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText title style={styles.sectionTitle}>
          Nutrition Advice for Active Lifestyles
        </ThemedText>

        {advice.map((item) => (
          <View key={item.number} style={styles.adviceItem}>
            <Text style={[styles.adviceNumber, { color: theme.title }]}>
              {item.number}.
            </Text>
            <View style={styles.adviceContent}>
              <ThemedText title style={styles.adviceTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.adviceText}>
                {item.content}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  )
}

export default NutritionAdvice

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  adviceItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  adviceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 30,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
})

