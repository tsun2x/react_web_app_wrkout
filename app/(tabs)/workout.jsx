import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useRouter, useGlobalSearchParams } from 'expo-router';


const { width } = Dimensions.get('window');

// DEFAULT WORKOUTS that are shown initially
const DEFAULT_WORKOUTS = [
    { id: '1', text: 'Walking' },
    { id: '2', text: 'Outdoor Running' },
    { id: '3', text: 'Outdoor Cycling' },
];


const WorkoutScreen = () => {
    const [activeWorkouts, setActiveWorkouts] = useState(DEFAULT_WORKOUTS); 
    const [activeIndex, setActiveIndex] = useState(0);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const flatListRef = useRef(null); // Ref for the main content carousel
    const headerListRef = useRef(null); // Ref for the new scrollable header
    const router = useRouter();
    const params = useGlobalSearchParams();
    
    // if mag work na ang newWorkout or detedct mag update ang carousel 
    useEffect(() => {
        if (params.newWorkouts) {
            try {
                const newWorkouts = JSON.parse(params.newWorkouts);
                
                if (newWorkouts && newWorkouts.length > 0) {
                    const newWorkoutTexts = newWorkouts.map(w => w.text).sort().join('');
                    const activeWorkoutTexts = activeWorkouts.map(w => w.text).sort().join('');

                    if (newWorkoutTexts !== activeWorkoutTexts) {
                        setActiveWorkouts(newWorkouts);
                    }
                } else {
                    setActiveWorkouts(DEFAULT_WORKOUTS); 
                }

                // Reset param after use
                router.setParams({ newWorkouts: undefined });
                
            } catch (e) {
                console.error("Failed to parse newWorkouts param:", e);
            }
        }
    }, [params.newWorkouts]); 


    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width); 
        setActiveIndex(newIndex);
        
        // Synchronize the header list's scroll position
        headerListRef.current?.scrollToIndex({
            animated: true,
            index: newIndex,
            viewPosition: 0.5 // Centers the active item in the header
        });
    };

    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            // Scroll main carousel smoothly
            flatListRef.current.scrollToIndex({
                animated: true, 
                index: index,
                viewPosition: 0 
            });
            setActiveIndex(index);
        }
        
        // Scroll header list smoothly and center the active item
        headerListRef.current?.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.5
        });
    };

    // New Render function for the Horizontal Scrollable Header/Pagination
    const renderHeaderWorkoutItem = ({ item, index }) => {
        const isSelected = activeIndex === index;
        
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.headerItem}
                onPress={() => scrollToIndex(index)} 
            >
                <ThemedText style={[
                    styles.headerItemText, 
                    { 
                        // Highlight active item
                        color: isSelected ? '#ff9500' : theme.text ,
                        fontWeight: isSelected ? '900' : '500',
                    }
                ]}>
                    {item.text}
                </ThemedText>
            </TouchableOpacity>
        );
    };

    // Render item for FlatList (Main Content Carousel)
    const renderWorkoutItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[
                    styles.slideContainer,
                    { backgroundColor: theme.cardBackground } 
                ]}
                onPress={() => {
                    router.navigate({
                        pathname: 'WorkoutDetails',
                        params: { workoutName: item.text }
                    });
                }}
            >
                {/* Workout Name */}
                <ThemedText style={[styles.text, { 
                    color: theme.text,
                }]}>
                    {item.text}
                </ThemedText>
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
                currentActiveWorkouts: JSON.stringify(activeWorkouts) // pass current list
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
    // Styles for the scrollable header/pagination
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
    // Styles for the main content carousel
    mainCarouselContainer: {
        flex: 1,
        width: '100%',
        fontWeight: ''
    },
    slideContainer: {
        width: width,
        height: 80,
        justifyContent: 'center',
        alignItems: 'flex-start', 
        paddingHorizontal: 20, 
        marginVertical: 10,
        borderRadius: 8,
    },
    text: {
        fontSize: 26, 
        fontWeight: 'bold',
        textAlign: 'left',
    },
    indexText: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 2,
    },
});