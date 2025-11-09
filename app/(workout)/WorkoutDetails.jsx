import { StyleSheet, View, useColorScheme } from 'react-native';
import React from 'react';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import Timer from './Timer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const DEFAULT_WORKOUT_NAMES = [
    'Walking', 
    'Outdoor Running', 
    'Outdoor Cycling'
];

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
        <ThemedText style={[styles.connectText, { color: theme.text }]}>
            This workout requires a connected fitness device for tracking.
        </ThemedText>
    </View>
);

const WorkoutDetails = () => {
    const { workoutName } = useLocalSearchParams(); 
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const router = useRouter(); 

    const isDefaultWorkout = DEFAULT_WORKOUT_NAMES.includes(workoutName);

    // Function handles navigation back to the main workout screen
    const handleWorkoutEnd = () => {
        // Use 'replace' to go back and replace 'WorkoutDetails'
        router.replace('/workout');
    };

    return (
        <ThemedView style={styles.container}>
            {isDefaultWorkout ? (
                // Passed the callback function to the Timer
                <Timer
                    workoutName={workoutName || "Workout"}
                    onWorkoutEnd={handleWorkoutEnd} // Triggers navigation when timer finishes
                />
            ) : (
                <View style={styles.centeredContentWrapper}>
                    {/* Shows this message for non-default workouts */}
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
        top: 150,
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
        textAlign: 'center',
    },
    connectText: {
        fontSize: 16,
        textAlign: 'center',
    }
});