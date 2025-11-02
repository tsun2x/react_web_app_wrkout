import { StyleSheet, useColorScheme, Text, View, Dimensions, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'
import { PieChart } from "react-native-gifted-charts";
import LinkWithTransition from '../../components/LinkWithTransition';
import CardWithTransition from '../../components/CardWithTransition';
import { useRouter } from 'expo-router';

// themed components
import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedCard from '../../components/ThemedCard'

const { width } = Dimensions.get('window');

const HORIZONTAL_GAP = 10;
const PADDING_HORIZONTAL = 20;

const cardWidth = (width - (PADDING_HORIZONTAL * 2.50) - HORIZONTAL_GAP) / 2;

const Home = () => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const router = useRouter(); // Initialize router in the screen component
  const [todayWorkout, setTodayWorkout] = useState(null);

  const handleNavigate = () => {
    // This function will be passed to the CardWithTransition component
    router.push("/(home_page)/weightCard");
  };

  // Check if today matches workout plan days
  const checkTodayWorkout = async () => {
    try {
      const planData = await AsyncStorage.getItem('workoutPlan');
      if (!planData) {
        setTodayWorkout(null);
        return;
      }

      const plan = JSON.parse(planData);
      const today = new Date();
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayDayName = daysOfWeek[today.getDay()];

      // Check if today is in the selected days
      if (plan.selectedDays && plan.selectedDays.includes(todayDayName)) {
        setTodayWorkout({
          duration: plan.duration,
          workoutGoal: plan.workoutGoal,
        });
      } else {
        setTodayWorkout(null);
      }
    } catch (error) {
      console.error('Error loading workout plan:', error);
      setTodayWorkout(null);
    }
  };

  // Load workout plan on mount and when screen is focused
  useEffect(() => {
    checkTodayWorkout();
  }, []);

  // Also check when component updates
  useEffect(() => {
    const interval = setInterval(() => {
      checkTodayWorkout();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const stepsData = [
    { value: 180, color: '#ff9500' },
    { value: 30, color: '#ffffffc3' }
  ];
  const caloriesData = [
    { value: 85, color: '#34c759' },
    { value: 15, color: '#ffffffc3' }
  ];
  const durationData = [
    { value: 60, color: '#007aff' },
    { value: 40, color: '#ffffffc3' }
  ];

  const healthData = [
    {
      id: 'steps',
      label: 'Steps',
      value: '4613',
      goal: '15000 steps',
      color: '#ff9500', // Orange/Brown for Steps
    },
    {
      id: 'calories',
      label: 'Calories',
      value: '378',
      goal: '300 kcal',
      color: '#34c759', // Green for Calories
    },
    {
      id: 'workout',
      label: 'Workout Duration',
      value: '41',
      goal: '30 min',
      color: '#007aff', // Blue for Workout Duration
    },
  ];

  return (
    <ScrollView 
        contentContainerStyle={styles.scrollViewContent} 
        showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.title}>FitLife</ThemedText>

        <View style={styles.chartWrapper}>

          <View style={styles.wrap}>
            <View style={styles.chartContainer}>
              <PieChart
                data={stepsData}
                donut={true}
                radius={70}
                innerRadius={55}
                borderRadius={8}
              />
              <View style={[styles.overlayChart, { transform: [{ scale: 0.68 }] }]}>
                <PieChart
                  data={caloriesData}
                  donut={true}
                  radius={78}
                  innerRadius={55}
                  borderRadius={8}
                />
              </View>
              <View style={[styles.overlayChart, { transform: [{ scale: 0.46 }] }]}>
                <PieChart
                  data={durationData}
                  donut={true}
                  radius={78}
                  innerRadius={55}
                  borderRadius={8}
                  centerLabelComponent={() => {
                    return <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Activity</Text>;
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.listContainer}>
            {healthData.map((item) => (
              <View key={item.id} style={styles.listItem}>

                <View style={styles.dotAndLabel}>

                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />

                  <Text style={[styles.labelText, { color: theme.text }]}>{item.label}</Text>
                </View>

                <View style={styles.valueContainer}>
                  <Text style={[styles.valueText, { color: theme.text }]}>{item.value}</Text>
                  <Text style={styles.goalText}>/{item.goal}</Text>
                </View>

              </View>
            ))}
          </View>

        </View>

      <Spacer />
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          console.log('Navigating to workout goal');
          router.push('/(workout_plan)/workoutGoal');
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.planCardTouchable}
      >
        <ThemedCard style={styles.planCard}>
          <ThemedText title={true}>Create your plan</ThemedText>
          <ThemedText style={ { color: Colors.dark.tint } }>Create</ThemedText>
        </ThemedCard>
      </TouchableOpacity>

      <View style={styles.flexWrapper}>
        <ThemedCard style={ styles.tallCard }>
          <View style={styles.todayWorkoutHeader}>
            <Ionicons name="barbell" size={24} color={theme.iconColorFocused} />
            <ThemedText title={true} style={styles.todayWorkoutTitle}>Today's Workout</ThemedText>
          </View>
          {todayWorkout ? (
            <View style={styles.todayWorkoutContent}>
              <ThemedText style={styles.todayWorkoutDuration}>
                {todayWorkout.duration} min
              </ThemedText>
              <ThemedText style={styles.todayWorkoutGoal}>
                {todayWorkout.workoutGoal}
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.noWorkoutText}>No workout scheduled</ThemedText>
          )}
        </ThemedCard>
        
        <CardWithTransition
          onCardPress={handleNavigate}
        >
        <ThemedCard style={ styles.tallCard }>
          <ThemedText title={true}>Weight</ThemedText>
        </ThemedCard>
        </CardWithTransition>

        <Link href={"/(home_page)/healthTips"}>
        <ThemedCard style={ styles.tallCard }>
          <ThemedText title={true}>Health Tips</ThemedText>
        </ThemedCard></Link>

        <Link href={"/(home_page)/nutritionAdvice"}>
        <ThemedCard style={ styles.tallCard }>
          <ThemedText title={true}>Nutrition Advice</ThemedText>
        </ThemedCard></Link>
      </View>


      </ThemedView>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  scrollViewContent: {
      flexGrow: 1, 
  },
  container: {

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 0,
    paddingTop: 50,
    paddingLeft: 23
  },
  chartWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 5
  },
  chartContainer: {
    height: 200,
    width: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayChart: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    marginRight: -10,
    marginTop: 15,
    marginLeft: -20,
  },


  listContainer: {
    paddingTop: 15,
    marginTop: 15,
    borderRadius: 10,
  },
  listItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dotAndLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 1
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '400',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalText: {
    color: '#9e9e9e',
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 3,
  },
  planCardTouchable: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  planCard: {
    // Card styles are handled by ThemedCard
  },
  flexWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    paddingHorizontal: PADDING_HORIZONTAL,
    marginTop: 10,
    marginBottom: 20,
  },
  tallCard: {
    width: cardWidth, 
    height: 180, 
    marginBottom: 20, 
  },
  todayWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  todayWorkoutTitle: {
    marginLeft: 8,
  },
  todayWorkoutContent: {
    flex: 1,
    justifyContent: 'center',
  },
  todayWorkoutDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  todayWorkoutGoal: {
    fontSize: 14,
    opacity: 0.8,
  },
  noWorkoutText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 10,
  },
})