import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';

const PlanOverview = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useLocalSearchParams();
  const navRouter = useRouter();

  const [planData, setPlanData] = useState({
    bmi: parseFloat(router.bmi) || 26.6,
    workoutGoal: router.workoutGoal || 'Lose Weight',
    weightGoal: parseFloat(router.weightGoal) || 77,
    duration: parseInt(router.duration) || 40,
    selectedDays: router.selectedDays ? router.selectedDays.split(',') : ['Mon', 'Wed', 'Thu'],
    weeks: parseInt(router.weeks) || 2,
    sportsReminder: router.sportsReminder === 'true',
    reminderTime: router.reminderTime || '8:00 AM',
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState([]);

  useEffect(() => {
    // Calculate end date based on weeks (weeks * 7 days)
    const totalDays = planData.weeks * 7;
    const end = new Date(startDate);
    end.setDate(end.getDate() + totalDays - 1);
    setEndDate(end);

    // Generate calendar dates based on weeks
    const dates = [];
    const current = new Date(startDate);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    
    // Get selected day indices
    const selectedDayIndices = planData.selectedDays.map(d => dayMap[d]);

    // Generate dates for the selected weeks
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(current);
      date.setDate(current.getDate() + i);
      const dayIndex = date.getDay();
      const isSelected = selectedDayIndices.includes(dayIndex);
      
      dates.push({
        date: date.getDate(),
        day: daysOfWeek[dayIndex],
        isSelected,
      });
    }
    setCalendarDates(dates);
  }, [planData.selectedDays, planData.weeks, startDate]);

  const calculateCalories = () => {
    const baseCalories = planData.duration * 10;
    if (planData.workoutGoal === 'Lose Weight') return Math.round(baseCalories * 1.2);
    if (planData.workoutGoal === 'Gain Muscle') return Math.round(baseCalories * 0.8);
    return Math.round(baseCalories);
  };

  const getTotalDays = () => {
    return planData.selectedDays.length * planData.weeks;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleDone = async () => {
    // Save workout plan to AsyncStorage
    const workoutPlan = {
      bmi: planData.bmi,
      workoutGoal: planData.workoutGoal,
      weightGoal: planData.weightGoal,
      duration: planData.duration,
      selectedDays: planData.selectedDays,
      weeks: planData.weeks,
      sportsReminder: planData.sportsReminder,
      reminderTime: planData.reminderTime,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    try {
      await AsyncStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
    
    // Navigate to homepage (tabs index)
    navRouter.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Date Range */}
        <View style={styles.headerSection}>
          <Text style={[styles.planTitle, { color: theme.title }]}>
            Plan to {planData.workoutGoal === 'Lose Weight' ? 'Lose Weight' : 
                    planData.workoutGoal === 'Gain Muscle' ? 'Gain Muscle' : 'Keep Fit'}
          </Text>
          <Text style={[styles.dateRange, { color: theme.text }]}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <View style={[styles.avatarHead, { backgroundColor: theme.text }]} />
            <View style={[styles.avatarBody, { backgroundColor: theme.uiBackground }]} />
            <View style={[styles.avatarArm, { backgroundColor: theme.uiBackground }]} />
          </View>
        </View>

        {/* Plan Details Cards */}
        <View style={styles.detailsSection}>
          <View style={[styles.detailCard, { backgroundColor: theme.uiBackground }]}>
            <Text style={[styles.detailText, { color: theme.title }]}>
              BMI: {planData.bmi.toFixed(1)}
            </Text>
          </View>
          <View style={[styles.detailCard, { backgroundColor: theme.uiBackground }]}>
            <Text style={[styles.detailText, { color: theme.title }]}>
              Workout Goal: {planData.workoutGoal}
            </Text>
          </View>
          <View style={[styles.detailCard, { backgroundColor: theme.uiBackground }]}>
            <Text style={[styles.detailText, { color: theme.title }]}>
              Weight Goal: {planData.weightGoal} kg
            </Text>
          </View>
        </View>

        {/* Summary Statistics */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.title }]}>
              {planData.weeks} {planData.weeks === 1 ? 'Week' : 'Weeks'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.title }]}>
              {planData.selectedDays.length} Day
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Weekly</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.title }]}>
              {getTotalDays()} Day
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.title }]}>
              {planData.duration} min
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Daily Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.title }]}>
              {calculateCalories()} kcal
            </Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>Consumption</Text>
          </View>
        </View>

        {/* Sports Reminder and Time */}
        {planData.sportsReminder && (
          <View style={styles.reminderSection}>
            <View style={styles.reminderRow}>
              <Text style={[styles.reminderLabel, { color: theme.title }]}>
                Sports Reminder (Sports Day)
              </Text>
              <View style={[styles.toggleActive, { backgroundColor: '#ff9500' }]} />
            </View>
            <View style={styles.reminderRow}>
              <Text style={[styles.reminderLabel, { color: theme.title }]}>
                Reminder Time
              </Text>
              <Text style={[styles.reminderTime, { color: theme.title }]}>
                {planData.reminderTime}
              </Text>
            </View>
          </View>
        )}

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <Text style={[styles.calendarTitle, { color: theme.title }]}>Calendar</Text>
          <View style={[styles.calendarCard, { backgroundColor: theme.uiBackground }]}>
            {/* Days of Week */}
            <View style={styles.calendarHeader}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={[styles.calendarDayLabel, { color: theme.text }]}>
                  {day}
                </Text>
              ))}
            </View>
            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarDates.map((item, index) => (
                <View key={index} style={styles.calendarCell}>
                  <Text style={[styles.calendarDate, { color: theme.title }]}>
                    {item.date}
                  </Text>
                  {item.isSelected && (
                    <View style={[styles.calendarDot, { backgroundColor: '#ff9500' }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Done Button */}
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateRange: {
    fontSize: 14,
    opacity: 0.7,
  },
  avatarContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  avatarHead: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: -10,
  },
  avatarBody: {
    width: 60,
    height: 50,
    borderRadius: 30,
    marginLeft: 10,
  },
  avatarArm: {
    width: 15,
    height: 40,
    borderRadius: 7.5,
    position: 'absolute',
    right: -5,
    top: 30,
    transform: [{ rotate: '-30deg' }],
  },
  detailsSection: {
    marginBottom: 25,
    gap: 10,
  },
  detailCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statItem: {
    width: '48%',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  reminderSection: {
    marginBottom: 25,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  reminderLabel: {
    fontSize: 16,
  },
  toggleActive: {
    width: 50,
    height: 30,
    borderRadius: 15,
  },
  reminderTime: {
    fontSize: 16,
  },
  calendarSection: {
    marginBottom: 30,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  calendarCard: {
    padding: 15,
    borderRadius: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  calendarDayLabel: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarCell: {
    width: '14.28%',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  doneButton: {
    backgroundColor: '#ff9500',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanOverview;

