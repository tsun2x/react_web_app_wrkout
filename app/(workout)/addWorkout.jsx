import { StyleSheet, Text, View, useColorScheme, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useMemo } from 'react'
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useRouter, useLocalSearchParams } from 'expo-router';


// mga non default workouts na pede pilian ng mga users
const ALL_NON_DEFAULT_WORKOUTS = [
    { id: '4', text: 'Rope skipping', icon: 'accessibility' },
    { id: '5', text: 'Badminton', icon: 'tennisball' },
    { id: '6', text: 'Basketball', icon: 'basketball' },
    { id: '7', text: 'Football', icon: 'football' },
    { id: '8', text: 'Mountaineering', icon: 'walk' },
    { id: '9', text: 'Elliptical Trainer', icon: 'speedometer' },
    { id: '10', text: 'Yoga', icon: 'body' },
];

const DEFAULT_WORKOUTS = [
    { id: '1', text: 'Walking' },
    { id: '2', text: 'Outdoor Running' },
    { id: '3', text: 'Outdoor Cycling' },
];


// Component for a single item in the selection list (WorkoutListItem)
const WorkoutListItem = ({ item, isSelected, onToggle, theme }) => {
    const iconName = isSelected ? 'checkbox-outline' : 'square-outline';
    const iconColor = isSelected ? theme.tint : theme.text;
    const checkboxColor = isSelected ? theme.tint : theme.textSecondary;

    return (
        <TouchableOpacity style={styles.listItem} onPress={() => onToggle(item.id)}>
            <View style={styles.leftContent}>
                <Ionicons name={item.icon} size={24} color={iconColor} style={styles.icon} />
                <ThemedText style={styles.itemText}>{item.text}</ThemedText>
            </View>
            <Ionicons name={iconName} size={24} color={checkboxColor} />
        </TouchableOpacity>
    );
};


const AddWorkoutScreen = () => {

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    const router = useRouter();

    // dito na mag receive angf mga active owrkout list sa owrekuot.jsx
    const params = useLocalSearchParams();

    // i-pass ang list tas balik lng ulit default if nag reload/npx expo start ulit
    const activeWorkouts = params.currentActiveWorkouts ? JSON.parse(params.currentActiveWorkouts) : DEFAULT_WORKOUTS;

    // maggawa ng Id para optimization lng para maghanap 
    const activeIds = useMemo(() => new Set(activeWorkouts.map(w => w.id)), [activeWorkouts]);

    // para sa mga workouts na wala sa carousel ...Filter to indicated naman
    const selectableWorkouts = ALL_NON_DEFAULT_WORKOUTS.filter(workout =>
        !activeIds.has(workout.id)
    );

    // mag state to ng mga selected workout
    const [selectedNewWorkoutIds, setSelectedNewWorkoutIds] = useState([]);

    const selectedCount = selectedNewWorkoutIds.length;

    const handleToggleWorkout = (id) => {
        setSelectedNewWorkoutIds(prevIds => {
            if (prevIds.includes(id)) {
                return prevIds.filter(itemId => itemId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    // LOGIC sa combine ng add and selected WOrkoutds
    const handleAddWorkouts = () => {

        // kunin ang selected workout sa filter list
        const newlySelectedWorkouts = selectableWorkouts.filter(workout =>
            selectedNewWorkoutIds.includes(workout.id)
        );

        // combine sa previous workout to newly selected ones
        const finalWorkoutsList = [...activeWorkouts, ...newlySelectedWorkouts];

        // global param and navigate bback
        router.setParams({
            newWorkouts: JSON.stringify(finalWorkoutsList)
        });
        router.back();
    };

    const renderItem = ({ item }) => (
        <WorkoutListItem
            item={item}
            isSelected={selectedNewWorkoutIds.includes(item.id)}
            onToggle={handleToggleWorkout}
            theme={theme}
        />
    );

    const handleNavigateToDelete = () => {
        router.push({
            pathname: "/(workout)/deleteSelectedWorkout",
            params: {
                activeWorkouts: JSON.stringify(activeWorkouts)
            }
        });
    };




    return (
        <ThemedView style={styles.container}>


            
                {/* Delete Button */}
                <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: theme.cardBackground, marginRight: 10 }]}
                    onPress={() => {
                        router.navigate({ 
                            pathname: 'deleteSelectedWorkout',
                            params: { activeWorkouts: JSON.stringify(activeWorkouts) } 
                        });
                    }}
                >
                    <Ionicons 
                        name="trash-bin-outline" 
                        size={24} 
                        color={theme.iconColor} 
                    />
                </TouchableOpacity>


            <FlatList
                data={selectableWorkouts} // shows worktu wala sa carousel
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>All available workouts have been added.</Text>
                    </View>
                )}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        { backgroundColor: theme.tint, opacity: selectedCount > 0 ? 1 : 0.5 }
                    ]}
                    onPress={handleAddWorkouts}
                    disabled={selectedCount === 0}
                >
                    <Text style={[styles.addButtonText, { color: 'white' }]}>
                        Add ({selectedCount})
                    </Text>
                </TouchableOpacity>
            </View>
        </ThemedView>
    )
}

export default AddWorkoutScreen

export const options = {
    headershown: false,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#444',
    },
    closeButton: {
        padding: 5,
    },
    list: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#444',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 15,
    },
    itemText: {
        fontSize: 18,
    },
    buttonContainer: {
        padding: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#333',
    },
    addButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        paddingTop: 50, alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    }
})