import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Colors } from '../../constants/Colors';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';

const WorkoutGoal = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [bmi, setBmi] = useState(36.7);
  const [workoutGoal, setWorkoutGoal] = useState('Keep Fit');
  const [weightGoal, setWeightGoal] = useState(77);

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { label: 'Underweight', color: '#34c759' };
    if (bmiValue < 25) return { label: 'Normal', color: '#5ac8fa' };
    if (bmiValue < 30) return { label: 'Overweight', color: '#ff9500' };
    return { label: 'Obese', color: '#ff3b30' };
  };

  const bmiCategory = getBMICategory(bmi);

  const handleNext = () => {
    router.push({
      pathname: '/(workout_plan)/workoutFrequency',
      params: {
        bmi: bmi.toString(),
        workoutGoal,
        weightGoal: weightGoal.toString(),
      }
    });
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
              Please fill in your workout
            </Text>
          </View>
        </View>

        {/* Your BMI Section */}
        <View style={styles.section}>
          <ThemedText title style={styles.sectionTitle}>Your BMI</ThemedText>
          <ThemedText style={styles.bmiValue}>BMI: {bmi.toFixed(1)}</ThemedText>
          
          {/* BMI Gradient Bar */}
          <View style={styles.bmiBarContainer}>
            <LinearGradient
              colors={['#34c759', '#5ac8fa', '#ff9500', '#ff3b30']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bmiBar}
            />
            <View style={styles.bmiLabels}>
              <Text style={[styles.bmiLabel, { color: theme.text }]}>18.4</Text>
              <Text style={[styles.bmiLabel, { color: theme.text }]}>24.9</Text>
              <Text style={[styles.bmiLabel, { color: theme.text }]}>29.9</Text>
            </View>
            <View style={[styles.bmiIndicator, { left: `${Math.min((bmi - 15) / 30 * 100, 95)}%` }]}>
              <View style={styles.indicatorLine} />
              <View style={styles.indicatorDot} />
            </View>
          </View>
          <Text style={[styles.bmiCategory, { color: bmiCategory.color }]}>
            {bmiCategory.label}
          </Text>
        </View>

        {/* BMI Slider */}
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderValue, { color: '#ff9500' }]}>
            {bmi.toFixed(1)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={45}
            value={bmi}
            onValueChange={setBmi}
            step={0.1}
            minimumTrackTintColor="#ff9500"
            maximumTrackTintColor={theme.uiBackground}
            thumbTintColor={theme.text}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: theme.text }]}>15</Text>
            <Text style={[styles.sliderLabel, { color: theme.text }]}>45</Text>
          </View>
        </View>

        {/* Workout Goal Section */}
        <View style={styles.section}>
          <ThemedText title style={styles.sectionTitle}>Workout Goal</ThemedText>
          <View style={styles.goalCards}>
            <TouchableOpacity
              style={[
                styles.goalCard,
                { backgroundColor: workoutGoal === 'Gain Muscle' ? '#ff9500' : theme.uiBackground }
              ]}
              onPress={() => setWorkoutGoal('Gain Muscle')}
            >
              <Ionicons 
                name="fitness" 
                size={32} 
                color={workoutGoal === 'Gain Muscle' ? '#fff' : theme.text} 
              />
              <Text style={[
                styles.goalText,
                { color: workoutGoal === 'Gain Muscle' ? '#fff' : theme.text }
              ]}>
                Gain Muscle
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goalCard,
                { backgroundColor: workoutGoal === 'Keep Fit' ? '#ff9500' : theme.uiBackground }
              ]}
              onPress={() => setWorkoutGoal('Keep Fit')}
            >
              <Ionicons 
                name="heart" 
                size={32} 
                color={workoutGoal === 'Keep Fit' ? '#fff' : theme.text} 
              />
              <Text style={[
                styles.goalText,
                { color: workoutGoal === 'Keep Fit' ? '#fff' : theme.text }
              ]}>
                Keep Fit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goalCard,
                { backgroundColor: workoutGoal === 'Lose Weight' ? '#ff9500' : theme.uiBackground }
              ]}
              onPress={() => setWorkoutGoal('Lose Weight')}
            >
              <Ionicons 
                name="resize" 
                size={32} 
                color={workoutGoal === 'Lose Weight' ? '#fff' : theme.text} 
              />
              <Text style={[
                styles.goalText,
                { color: workoutGoal === 'Lose Weight' ? '#fff' : theme.text }
              ]}>
                Lose Weight
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Goal Section */}
        <View style={styles.section}>
          <ThemedText title style={styles.sectionTitle}>Weight Goal</ThemedText>
          <Text style={[styles.weightValue, { color: theme.title }]}>
            {weightGoal} kg
          </Text>
          
          {/* Weight Slider */}
          <View style={styles.weightSliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={40}
              maximumValue={150}
              value={weightGoal}
              onValueChange={(value) => setWeightGoal(Math.round(value))}
              step={1}
              minimumTrackTintColor="#ff9500"
              maximumTrackTintColor={theme.uiBackground}
              thumbTintColor={theme.text}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: theme.text }]}>40</Text>
              <Text style={[styles.sliderLabel, { color: theme.text }]}>150</Text>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
  bmiValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  bmiBarContainer: {
    height: 30,
    marginBottom: 10,
    position: 'relative',
  },
  bmiBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  bmiLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  bmiLabel: {
    fontSize: 12,
  },
  bmiIndicator: {
    position: 'absolute',
    top: -5,
    alignItems: 'center',
  },
  indicatorLine: {
    width: 2,
    height: 20,
    backgroundColor: '#fff',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginTop: -4,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  sliderContainer: {
    marginBottom: 30,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
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
    marginTop: 5,
  },
  sliderLabel: {
    fontSize: 12,
  },
  goalCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginHorizontal: 5,
  },
  goalText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  weightSliderContainer: {
    marginBottom: 20,
  },
  weightRuler: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    height: 50,
    paddingHorizontal: 10,
  },
  rulerTick: {
    alignItems: 'center',
    width: '5%',
  },
  rulerLine: {
    width: 2,
    marginBottom: 5,
  },
  rulerLabel: {
    fontSize: 12,
  },
  weightIndicator: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  weightIndicatorLine: {
    width: 3,
    height: 30,
  },
  bmiControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  bmiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bmiButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weightControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  weightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  weightButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#ff9500',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutGoal;

