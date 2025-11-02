import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Colors } from '../../constants/Colors';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';

const WorkoutFrequency = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();
  const params = useLocalSearchParams();

  const [duration, setDuration] = useState(30);
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Wed', 'Thu', 'Fri']);
  const [weeks, setWeeks] = useState(2);
  const [sportsReminder, setSportsReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('8:00 AM');
  const [isGenerating, setIsGenerating] = useState(false);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 3) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleGeneratePlan = () => {
    if (selectedDays.length < 3) {
      alert('Please choose at least 3 days per week for workouts.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate plan generation
    setTimeout(() => {
      setIsGenerating(false);
      router.push({
        pathname: '/(workout_plan)/planOverview',
        params: {
          bmi: params.bmi,
          workoutGoal: params.workoutGoal,
          weightGoal: params.weightGoal,
          duration: duration.toString(),
          selectedDays: selectedDays.join(','),
          weeks: weeks.toString(),
          sportsReminder: sportsReminder.toString(),
          reminderTime,
        }
      });
    }, 2000);
  };

  const calculateCalories = () => {
    // Simple calculation based on duration and workout goal
    const baseCalories = duration * 10;
    if (params.workoutGoal === 'Lose Weight') return baseCalories * 1.2;
    if (params.workoutGoal === 'Gain Muscle') return baseCalories * 0.8;
    return baseCalories;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar and Message */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <View style={[styles.avatarHead, { backgroundColor: theme.text }]} />
            <View style={[styles.avatarBody, { backgroundColor: theme.uiBackground }]} />
          </View>
          <View style={[styles.speechBubble, { backgroundColor: theme.uiBackground }]}>
            <Text style={[styles.speechText, { color: theme.title }]}>
              Please fill in your workout frequency.
            </Text>
          </View>
        </View>

        {/* Daily Duration Section */}
        <View style={styles.section}>
          <ThemedText title style={styles.sectionTitle}>Daily Duration</ThemedText>
          <Text style={[styles.durationValue, { color: '#ff9500' }]}>
            {duration} min
          </Text>
          
          <View style={styles.durationSliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={180}
              value={duration}
              onValueChange={(value) => setDuration(Math.round(value))}
              step={5}
              minimumTrackTintColor="#ff9500"
              maximumTrackTintColor={theme.uiBackground}
              thumbTintColor={theme.text}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: theme.text }]}>10 min</Text>
              <Text style={[styles.sliderLabel, { color: theme.text }]}>180 min</Text>
            </View>
          </View>
        </View>

        {/* Days for Workout Section */}
        <View style={styles.section}>
          <ThemedText title style={styles.sectionTitle}>Days for Workout</ThemedText>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  { 
                    backgroundColor: selectedDays.includes(day) ? '#ff9500' : theme.uiBackground 
                  }
                ]}
                onPress={() => toggleDay(day)}
                disabled={selectedDays.includes(day) && selectedDays.length <= 3}
              >
                <Text style={[
                  styles.dayButtonText,
                  { 
                    color: selectedDays.includes(day) ? '#fff' : theme.text 
                  }
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.daysHint, { color: theme.text }]}>
            Choose at least 3 days per week for workouts.
          </Text>
        </View>

        {/* Weeks Selection Section */}
        <View style={styles.section}>
          <ThemedText title style={styles.sectionTitle}>Workout Duration (Weeks)</ThemedText>
          <Text style={[styles.weeksValue, { color: '#ff9500' }]}>
            {weeks} {weeks === 1 ? 'week' : 'weeks'}
          </Text>
          
          <View style={styles.weeksSliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={12}
              value={weeks}
              onValueChange={(value) => setWeeks(Math.round(value))}
              step={1}
              minimumTrackTintColor="#ff9500"
              maximumTrackTintColor={theme.uiBackground}
              thumbTintColor={theme.text}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: theme.text }]}>1 week</Text>
              <Text style={[styles.sliderLabel, { color: theme.text }]}>12 weeks</Text>
            </View>
          </View>
        </View>

        {/* Sports Reminder Section */}
        <View style={styles.toggleSection}>
          <ThemedText title style={styles.sectionTitle}>Sports Reminder (Sports Day)</ThemedText>
          <TouchableOpacity
            style={[
              styles.toggle,
              { backgroundColor: sportsReminder ? '#ff9500' : theme.uiBackground }
            ]}
            onPress={() => setSportsReminder(!sportsReminder)}
          >
            <View style={[
              styles.toggleThumb,
              { 
                backgroundColor: '#fff',
                left: sportsReminder ? 22 : 2
              }
            ]} />
          </TouchableOpacity>
        </View>

        {/* Reminder Time Section */}
        {sportsReminder && (
          <View style={styles.timeSection}>
            <ThemedText title style={styles.sectionTitle}>Reminder Time</ThemedText>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => {
                // In a real app, this would open a time picker
                alert('Time picker would open here');
              }}
            >
              <Text style={[styles.timeText, { color: theme.title }]}>{reminderTime}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Generate Plan Button */}
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={handleGeneratePlan}
          activeOpacity={0.8}
          disabled={isGenerating || selectedDays.length < 3}
        >
          {isGenerating ? (
            <View style={styles.generatingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.generateButtonText}>Generating your workout plan...</Text>
            </View>
          ) : (
            <Text style={styles.generateButtonText}>Generate Plan</Text>
          )}
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  avatarHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: -10,
  },
  avatarBody: {
    width: 50,
    height: 40,
    borderRadius: 25,
    marginLeft: 5,
  },
  speechBubble: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
  },
  speechText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  durationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  durationSliderContainer: {
    marginBottom: 15,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 10,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
  },
  durationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  durationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  durationButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  daysHint: {
    fontSize: 12,
    marginTop: 10,
    opacity: 0.7,
  },
  weeksValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  weeksSliderContainer: {
    marginBottom: 15,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    position: 'relative',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    top: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  timeSection: {
    marginBottom: 30,
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent',
  },
  timeText: {
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#ff9500',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  generatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutFrequency;

