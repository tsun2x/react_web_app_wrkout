import { StyleSheet, View, useColorScheme } from 'react-native';
import React from 'react';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router'; // useRouter is used here
import Timer from './Timer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

// Define the names of the workouts that should show the Timer
const DEFAULT_WORKOUT_NAMES = [
    'Walking', 
    'Outdoor Running', 
    'Outdoor Cycling'
];

// Component for the "Connect Device" message (for non-default workouts)
const ConnectDeviceMessage = ({ theme }) => (
    <View style={[styles.connectContainer, { backgroundColor: theme.cardBackground }]}>
        <Ionicons 
            name="bluetooth" 
            size={50} 
            color={theme.iconColorFocused} 
            style={styles.icon}
        />
        <ThemedText style={styles.connectTitle}>
            Device Required
        </ThemedText>
        <ThemedText style={[styles.connectText, { color: theme.textSecondary }]}>
            This workout requires a connected fitness device for tracking.
        </ThemedText>
    </View>
);

const WorkoutDetails = () => {
    const { workoutName } = useLocalSearchParams(); 
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const router = useRouter(); // Initialize router

    const isDefaultWorkout = DEFAULT_WORKOUT_NAMES.includes(workoutName);

    // Function called when the timer ends (passed to the Timer component)
    const handleWorkoutEnd = (results) => {
        // 💡 FIX: Explicitly navigate to the 'workout.jsx' file
        router.replace({
            // Path is: (root folder of the stack) / (file name of the carousel)
            pathname: '/workout', 
            params: {
                completedWorkout: JSON.stringify(results)
            }
        });
    };

    return (
        <ThemedView style={styles.container}>
            {isDefaultWorkout ? (
                // Passed the new callback function to the Timer
                <Timer 
                    workoutName={workoutName || "workout"} 
                    onWorkoutEnd={handleWorkoutEnd} // Passes the function to Timer
                />
            ) : (
                <View style={styles.centeredContentWrapper}>
                    <ConnectDeviceMessage theme={theme} />
                </View>
            )}
        </ThemedView>
    );
};

export default WorkoutDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centeredContentWrapper: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    connectContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 40,
        maxWidth: 400, 
    },
    icon: {
        marginBottom: 20,
    },
    connectTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    connectText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    }
});