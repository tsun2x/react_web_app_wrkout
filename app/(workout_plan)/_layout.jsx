import { Stack } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function WorkoutPlanLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTintColor: theme.title,
      }}
    >
      <Stack.Screen 
        name="workoutGoal"
        options={{ title: 'Workout Goal' }}
      />
      <Stack.Screen 
        name="workoutFrequency"
        options={{ title: 'Workout Frequency' }}
      />
      <Stack.Screen 
        name="planOverview"
        options={{ title: 'Plan Overview' }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({})

