import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'

const NutritionAdvice = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const advice = [
    {
      number: 1,
      icon: "restaurant-outline",
      title: "Eat Balanced Meals",
      content: "Every plate should have lean protein, complex carbs, and healthy fats to fuel performance.",
      color: "#ff9500"
    },
    {
      number: 2,
      icon: "leaf-outline",
      title: "Choose Whole Foods",
      content: "Pick natural, nutrient-rich options — fruits, veggies, whole grains, and lean meats.",
      color: "#34c759"
    },
    {
      number: 3,
      icon: "battery-charging-outline",
      title: "Pre-Workout Fuel",
      content: "Eat a light meal or snack 1–2 hours before training. Try oatmeal with fruit or a banana with peanut butter.",
      color: "#ff9500"
    },
    {
      number: 4,
      icon: "reload-outline",
      title: "Post-Workout Recovery",
      content: "Refuel within 30–60 minutes after exercise with protein and carbs — like a shake or chicken with rice.",
      color: "#007aff"
    },
    {
      number: 5,
      icon: "water-outline",
      title: "Hydrate All Day",
      content: "Water helps with energy, digestion, and recovery. Aim for 8–10 glasses daily (more if you sweat a lot).",
      color: "#5ac8fa"
    },
    {
      number: 6,
      icon: "time-outline",
      title: "Don't Skip Meals",
      content: "Stay consistent with meals to support metabolism and workout performance.",
      color: "#ff9500"
    },
    {
      number: 7,
      icon: "medical-outline",
      title: "Get Your Micros",
      content: "Vitamins and minerals like iron, magnesium, and vitamin D help maintain strength and recovery.",
      color: "#ff3b30"
    },
    {
      number: 8,
      icon: "pie-chart-outline",
      title: "Watch Your Portions",
      content: "Control portions to match your energy output — balance is key.",
      color: "#ff9500"
    },
    {
      number: 9,
      icon: "ban-outline",
      title: "Limit Sugar & Junk Food",
      content: "Reduce processed foods and sugary drinks that cause energy crashes.",
      color: "#ff3b30"
    },
    {
      number: 10,
      icon: "calendar-outline",
      title: "Plan Ahead",
      content: "Meal prep on weekends or nights before. It keeps your nutrition goals on track and saves time.",
      color: "#34c759"
    }
  ]

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
            <Ionicons name="nutrition" size={28} color="#ff9500" />
          </View>
          <View style={styles.headerText}>
            <ThemedText title style={styles.sectionTitle}>
              Nutrition Advice
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              for Active Lifestyles
            </ThemedText>
          </View>
        </View>

        {advice.map((item) => (
          <ThemedCard key={item.number} style={styles.adviceCard}>
            <View style={styles.adviceHeader}>
              <View style={[styles.adviceIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.adviceContent}>
                <View style={styles.adviceTitleRow}>
                  <Text style={[styles.adviceNumber, { color: theme.text }]}>
                    {item.number}.
                  </Text>
                  <ThemedText title style={styles.adviceTitle}>
                    {item.title}
                  </ThemedText>
                </View>
                <ThemedText style={styles.adviceText}>
                  {item.content}
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
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
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  adviceCard: {
    marginBottom: 16,
    padding: 20,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  adviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  adviceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 24,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  adviceText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
  },
})
