import { StyleSheet, Text, View, ScrollView, useColorScheme, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from "react-native-gifted-charts";
import { Colors } from '../../constants/Colors'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'

const { width } = Dimensions.get('window');

const WeightCard = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [weightData, setWeightData] = useState([]);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [targetWeight, setTargetWeight] = useState(null);

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      const planData = await AsyncStorage.getItem('workoutPlan');
      if (planData) {
        const plan = JSON.parse(planData);
        setWorkoutPlan(plan);
        setTargetWeight(plan.weightGoal);
        
        // Calculate current weight (start weight)
        // If no current weight stored, use a calculated starting weight based on BMI
        const currentWeightValue = plan.currentWeight || calculateStartingWeight(plan.bmi);
        setCurrentWeight(currentWeightValue);
        
        // Generate weight loss progression graph
        generateWeightProgression(plan, currentWeightValue);
      }
    } catch (error) {
      console.error('Error loading workout plan:', error);
    }
  };

  const calculateStartingWeight = (bmi) => {
    // Assuming average height of 1.70m (170cm) to calculate weight from BMI
    // Weight = BMI * (height in meters)^2
    const heightM = 1.70;
    return Math.round(bmi * (heightM * heightM));
  };

  const generateWeightProgression = (plan, startWeight) => {
    if (!plan.weightGoal || !plan.startDate || !plan.endDate) return;

    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const targetWeight = plan.weightGoal;
    const weightDifference = startWeight - targetWeight;
    const daysPerWeek = plan.selectedDays ? plan.selectedDays.length : 3;
    
    // Calculate total workout days in the plan duration
    const totalWorkoutDays = Math.floor((daysDiff / 7) * daysPerWeek);
    
    // Generate data points for each week
    const data = [];
    const weeks = Math.ceil(daysDiff / 7);
    
    for (let i = 0; i <= weeks; i++) {
      const dayIndex = i * 7;
      if (dayIndex <= daysDiff) {
        // Linear weight loss progression
        // Adjust based on workout goal
        let progressFactor = 0;
        if (plan.workoutGoal === 'Lose Weight') {
          progressFactor = 0.8; // Faster weight loss
        } else if (plan.workoutGoal === 'Gain Muscle') {
          progressFactor = 0.4; // Slower weight change (might gain muscle)
        } else {
          progressFactor = 0.6; // Moderate change for Keep Fit
        }
        
        const progress = Math.min(i / weeks, 1) * progressFactor;
        const projectedWeight = startWeight - (weightDifference * progress);
        
        data.push({
          value: Math.round(projectedWeight * 10) / 10, // Round to 1 decimal
          label: `W${i + 1}`,
          labelTextStyle: { color: theme.text, fontSize: 10 },
        });
      }
    }
    
    setWeightData(data);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  if (!workoutPlan) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedCard style={styles.emptyCard}>
            <ThemedText title style={styles.emptyTitle}>No Workout Plan Found</ThemedText>
            <ThemedText style={styles.emptyText}>
              Create a workout plan to see your weight loss progression graph.
            </ThemedText>
          </ThemedCard>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.15)' }]}>
            <Ionicons name="scale" size={28} color="#ff9500" />
          </View>
          <View style={styles.headerTextContainer}>
            <ThemedText title style={styles.sectionTitle}>Weight Progression</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Track your fitness journey</ThemedText>
          </View>
        </View>
        
        <ThemedCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Current Weight</ThemedText>
              <ThemedText title style={styles.summaryValue}>
                {currentWeight ? `${currentWeight} kg` : '--'}
              </ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Target Weight</ThemedText>
              <ThemedText title style={styles.summaryValue}>
                {targetWeight ? `${targetWeight} kg` : '--'}
              </ThemedText>
            </View>
          </View>
          {workoutPlan.startDate && workoutPlan.endDate && (
            <View style={styles.dateRange}>
              <ThemedText style={styles.dateText}>
                {formatDate(workoutPlan.startDate)} - {formatDate(workoutPlan.endDate)}
              </ThemedText>
            </View>
          )}
        </ThemedCard>

        {weightData.length > 0 ? (
          <ThemedCard style={styles.chartCard}>
            <ThemedText title style={styles.chartTitle}>Projected Weight Loss</ThemedText>
            <ThemedText style={styles.chartSubtitle}>
              Based on your {workoutPlan.workoutGoal} plan
            </ThemedText>
            <View style={styles.chartContainer}>
              <LineChart
                data={weightData}
                width={width - 80}
                height={220}
                spacing={width > 400 ? 50 : 30}
                thickness={3}
                color={workoutPlan.workoutGoal === 'Lose Weight' ? '#34c759' : 
                       workoutPlan.workoutGoal === 'Gain Muscle' ? '#007aff' : '#ff9500'}
                hideRules
                hideYAxisText
                hideDataPoints
                yAxisColor={theme.text}
                xAxisColor={theme.text}
                curved
                areaChart
                startFillColor={workoutPlan.workoutGoal === 'Lose Weight' ? 'rgba(52, 199, 89, 0.2)' : 
                               workoutPlan.workoutGoal === 'Gain Muscle' ? 'rgba(0, 122, 255, 0.2)' : 
                               'rgba(255, 149, 0, 0.2)'}
                endFillColor={workoutPlan.workoutGoal === 'Lose Weight' ? 'rgba(52, 199, 89, 0.05)' : 
                             workoutPlan.workoutGoal === 'Gain Muscle' ? 'rgba(0, 122, 255, 0.05)' : 
                             'rgba(255, 149, 0, 0.05)'}
                startOpacity={0.9}
                endOpacity={0.3}
                initialSpacing={0}
                noOfSections={4}
                maxValue={currentWeight ? currentWeight + 5 : 100}
                minValue={targetWeight ? targetWeight - 5 : 50}
                stepValue={5}
                yAxisTextStyle={{ color: theme.text, fontSize: 12 }}
                xAxisLabelTextStyle={{ color: theme.text, fontSize: 10 }}
              />
            </View>
          </ThemedCard>
        ) : (
          <ThemedCard style={styles.emptyCard}>
            <ThemedText style={styles.emptyText}>
              Weight progression data will appear here once you start tracking your weight.
            </ThemedText>
          </ThemedCard>
        )}
      </ScrollView>
    </ThemedView>
  )
}

export default WeightCard

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateRange: {
    marginTop: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    opacity: 0.6,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
})
