import { StyleSheet, Text, View, FlatList, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState, useMemo } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'
import { useRouter, useLocalSearchParams } from 'expo-router'


// list ng non deafault
const ALL_NON_DEFAULT_WORKOUTS = [
    { id: 'rs', text: 'Rope skipping', icon: 'accessibility' },
    { id: 'bd', text: 'Badminton', icon: 'tennisball' },
    { id: 'bb', text: 'Basketball', icon: 'basketball' },
    { id: 'fb', text: 'Football', icon: 'football' },
    { id: 'mt', text: 'Mountaineering', icon: 'walk' },
    { id: 'et', text: 'Elliptical Trainer', icon: 'speedometer' },
    { id: 'yg', text: 'Yoga', icon: 'body' },
];

// ids ng mga deafaulkt workout
const DEFAULT_WORKOUT_IDS = ['1', '2', '3'];

// Component for a single item in the selection list
const WorkoutListItem = ({ item, isSelected, onPress, theme }) => (
    <TouchableOpacity onPress={onPress} style={styles.listItem}>
        <View style={styles.leftContent}>
            <Ionicons name={item.icon || 'star'} size={24} color={theme.tint} style={styles.icon} />
            <ThemedText style={styles.itemText}>{item.text}</ThemedText>
        </View>
        {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={theme.tint} />
        )}
    </TouchableOpacity>
);


const DeleteSelectedWorkout = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const router = useRouter();
    const params = useLocalSearchParams();
    
    // Parse current active workouts from params
    const currentActiveWorkouts = useMemo(() => {
        if (params.activeWorkouts) {
            try {
                return JSON.parse(params.activeWorkouts);
            } catch (e) {
                console.error("Failed to parse activeWorkouts JSON", e);
            }
        }
        return []; // Should not happen if routed correctly
    }, [params.activeWorkouts]);

    // Workouts that can be deleted (only non-default ones)
    const deletableWorkouts = useMemo(() => {
        return currentActiveWorkouts.filter(item => 
            !DEFAULT_WORKOUT_IDS.includes(item.id) && item.id !== 'add'
        );
    }, [currentActiveWorkouts]);

    const [selectedForDeletionIds, setSelectedForDeletionIds] = useState([]);

    const toggleSelection = (id) => {
        setSelectedForDeletionIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(itemId => itemId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // The function causing the route issue
    const handleDeleteWorkouts = () => {
        // kunin mga mark Ids
        const workoutsToKeep = currentActiveWorkouts.filter(item => 
            !selectedForDeletionIds.includes(item.id)
        );

        // 💡 FIX: Use router.replace() to navigate to the workout screen 
        // and replace the current delete screen in the stack.
        router.replace({
            // Assuming your main screen is named 'workout.jsx' and is accessible via /workout
            pathname: '/workout',
            params: {
                // 'newWorkouts' is the parameter workout.jsx is listening for
                newWorkouts: JSON.stringify(workoutsToKeep)
            }
        });

        // router.back() is not needed with router.replace()
    };
    
    const selectedCount = selectedForDeletionIds.length;

    return (
        <ThemedView style={styles.container}>
            {/* Header with Close Button */}
            

            {/* List of Deletable Workouts */}
            <FlatList
                data={deletableWorkouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <WorkoutListItem
                        item={item}
                        isSelected={selectedForDeletionIds.includes(item.id)}
                        onPress={() => toggleSelection(item.id)}
                        theme={theme}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>No deletable custom workouts.</ThemedText>
                    </View>
                )}
            />

            {/* Delete Button */}
            <View style={[styles.buttonContainer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
                <TouchableOpacity 
                    style={[
                        styles.deleteButton, 
                        { backgroundColor: theme.error, opacity: selectedCount > 0 ? 1 : 0.5 }
                    ]}
                    onPress={handleDeleteWorkouts}
                    disabled={selectedCount === 0}
                >
                    <Text style={[styles.buttonText, { color: 'white' }]}>
                        Delete ({selectedCount})
                    </Text>
                </TouchableOpacity>
            </View>
        </ThemedView>
    )
}

export default DeleteSelectedWorkout

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingHorizontal: 15, height: 60, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#444',
    },
    closeButton: { padding: 5 },
    list: { flex: 1, paddingHorizontal: 20 },
    listItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#444',
    },
    leftContent: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 15 },
    itemText: { fontSize: 18 },
    buttonContainer: {
        padding: 20, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#333',
    },
    deleteButton: {
        padding: 15, borderRadius: 10, alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        opacity: 0.7,
    }
});