import React, { useState, useRef, useEffect } from 'react';
import { Image, Dimensions, StyleSheet, Text, View, FlatList, useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useRouter, useGlobalSearchParams } from 'expo-router';


// 💡 FIX: Destructure both width and height for layout calculations
const { width, height } = Dimensions.get('window');

// 🛠️ Corrected GIF paths (based on project structure: ../../assets/GIF/...)
const GIF_MAP = {
    'Walking': require('../../assets/GIF/walk.gif'),
    'Outdoor Running': require('../../assets/GIF/run.gif'),
    'Outdoor Cycling': require('../../assets/GIF/bycicle.gif'),
};

const DEFAULT_WORKOUT_NAMES = [
    'Walking',
    'Outdoor Running',
    'Outdoor Cycling'
];

// 🛠️ RESTORED: Default workouts with 'name' and 'description'
const DEFAULT_WORKOUTS = [
    { id: '1', name: 'Walking', description: "Don't Stop Hanggang di ka pa Masarap" },
    { id: '2', name: 'Outdoor Running', description: "Conquer every Stride" },
    { id: '3', name: 'Outdoor Cycling', description: "Pedal to Peak" },
];


const WorkoutScreen = () => {
    // Correctly map the name to text for the header's use
    const [activeWorkouts, setActiveWorkouts] = useState(DEFAULT_WORKOUTS.map(w => ({
        ...w,
        text: w.name // Use 'name' for the 'text' property required by the header
    })));
    const [activeIndex, setActiveIndex] = useState(0);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const flatListRef = useRef(null);
    const headerListRef = useRef(null);
    const router = useRouter();
    const params = useGlobalSearchParams();

    // useEffect to handle newWorkouts (for Add/Delete screens)
    useEffect(() => {
        if (params.newWorkouts) {
            try {
                const newWorkouts = JSON.parse(params.newWorkouts);

                if (newWorkouts && newWorkouts.length > 0) {
                    setActiveWorkouts(newWorkouts.map(w => ({
                        ...w,
                        lastWorkout: w.lastWorkout !== undefined ? w.lastWorkout : null
                    })));
                } else {
                    // Revert to original default structure if list is empty
                    setActiveWorkouts(DEFAULT_WORKOUTS.map(w => ({
                        ...w,
                        text: w.name // map back for header list compatibility
                    })));
                }

                router.setParams({ newWorkouts: undefined });

            } catch (e) {
                console.error("Failed to parse newWorkouts param:", e);
            }
        }
    }, [params.newWorkouts, router]);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width);
        setActiveIndex(newIndex);

        headerListRef.current?.scrollToIndex({
            animated: true,
            index: newIndex,
            viewPosition: 0.5
        });
    };

    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: index,
                viewPosition: 0
            });
            setActiveIndex(index);
        }

        headerListRef.current?.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.5
        });
    };

    const renderHeaderWorkoutItem = ({ item, index }) => {
        const isSelected = activeIndex === index;

        // Use item.name if available, otherwise fallback to item.text
        const workoutText = item.name || item.text;

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.headerItem}
                onPress={() => scrollToIndex(index)}
            >
                <ThemedText style={[
                    styles.headerItemText,
                    {
                        color: isSelected ? '#ff9500' : theme.text,
                        fontWeight: isSelected ? '900' : '500',
                    }
                ]}>
                    {workoutText}
                </ThemedText>
            </TouchableOpacity>
        );
    };

    const renderWorkoutItem = ({ item }) => {
        const workoutName = item.name || item.text;
        const gifSource = GIF_MAP[workoutName];
        const isDefaultWorkout = DEFAULT_WORKOUT_NAMES.includes(workoutName);
        const navigationWorkoutName = item.text;

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.slideContainerWireframe, { backgroundColor: theme.background }]}
                onPress={() => {
                    router.navigate({
                        pathname: 'WorkoutDetails',
                        params: { workoutName: navigationWorkoutName }
                    });
                }}
            >
                {/* 1. Description Text / Device Required Title (Large, Centered, Top) */}
                <View style={styles.topContentWireframe}>
                    {isDefaultWorkout && item.description ? (
                        <ThemedText style={[styles.descriptionTextWireframe, { color: theme.text }]}>
                            {item.description}
                        </ThemedText>
                    ) : (
                        // 💡 FIX: Display "Device Required" as the main text for custom workouts
                        <ThemedText style={[styles.descriptionTextWireframe, { color: theme.text }]}>
                            Device Required
                        </ThemedText>
                    )}
                </View>


                {/* 2. Empty View to Push GIF/Icon Down (Takes up all remaining space) */}
                <View style={styles.emptySpaceWireframe} />


                {/* 3. GIF/Icon (Bottom Center) */}
                <View style={styles.iconColumnWireframe}>
                    {gifSource && isDefaultWorkout ? (
                        // Default Workout: Display GIF/Start Icon
                        <Image
                            source={gifSource}
                            style={[styles.gifIconWireframe, { borderColor: theme.text, backgroundColor: theme.cardBackground }]}
                            resizeMode="contain"
                        />
                    ) : (
                        // Custom Workout: Display Bluetooth Icon
                        <Ionicons
                            name="bluetooth-outline"
                            size={100}
                            color={theme.text}
                            style={[{
                                borderColor: theme.text,
                                backgroundColor: theme.cardBackground,
                                alignItems: 'center',
                                borderRadius: 75,
                                borderWidth: 5,
                                display: 'flex',
                                overflow: 'hidden',
                                width: 150,
                                height: 150,
                                padding:18
                            }]}
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };


    const handleNavigateToDelete = () => {
        router.push({
            pathname: "/(workout)/deleteSelectedWorkout",
            params: {
                activeWorkouts: JSON.stringify(activeWorkouts)
            }
        });
    }
    const handleNavigateToAdd = () => {
        router.push({
            pathname: "/(workout)/addWorkout",
            params: {
                currentActiveWorkouts: JSON.stringify(activeWorkouts)
            }
        });
    };


    return (
        <ThemedView style={styles.container}>
            {/* Top Header: Title and Buttons */}
            <View style={styles.workoutWrapper}>
                <ThemedText title={true} style={[styles.title, { color: theme.title }]}>
                    Workouts
                </ThemedText>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleNavigateToDelete}>
                        <Ionicons
                            size={30}
                            color={theme.iconColor}
                            name={'remove-circle-outline'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={handleNavigateToAdd}>
                        <Ionicons
                            size={30}
                            color={theme.iconColor}
                            name={'add-circle-outline'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ThemedView style={styles.appContainer}>

                {/* Horizontal Scrollable Header (The new pagination) */}
                <View style={styles.headerPaginationContainer}>
                    <FlatList
                        ref={headerListRef}
                        data={activeWorkouts}
                        renderItem={renderHeaderWorkoutItem}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                {/* Main Content Carousel */}
                <View style={styles.mainCarouselContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={activeWorkouts}
                        renderItem={renderWorkoutItem}
                        keyExtractor={item => item.id}
                        horizontal
                        style={styles.wrapper}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        getItemLayout={(data, index) => (
                            { length: width, offset: width * index, index }
                        )}
                    />
                </View>
            </ThemedView>

        </ThemedView>
    );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    slideContainerWireframe: {
        width: width,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    topContentWireframe: {
        marginTop: height * 0.1,
        width: '100%',
        alignItems: 'center',
    },
    descriptionTextWireframe: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        width: width * 0.8,
    },
    emptySpaceWireframe: {
        flex: 1,
    },
    iconColumnWireframe: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: height * 0.1,
    },
    gifIconWireframe: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceRequiredTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 10,
    },
    deviceRequiredText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 0,
        paddingTop: 50,
        paddingLeft: 20,
    },
    container: {
        flex: 1,
    },
    workoutWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        marginTop: 50,
    },
    iconButton: {
        paddingHorizontal: 5,
    },
    appContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerPaginationContainer: {
        height: 40,
        width: '100%',
        paddingLeft: 20,
        marginBottom: 10,
    },
    headerItem: {
        justifyContent: 'center',
        paddingRight: 20,
    },
    headerItemText: {
        fontSize: 18,
        paddingVertical: 5,
    },
    mainCarouselContainer: {
        flex: 1,
        width: '100%',
    },
    indexText: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 2,
    },
});