import React, { useState, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router'; // Import useRouter

const { width } = Dimensions.get('window');

// Data structure
const data = [
  { id: 1, text: 'Walking' },
  { id: 2, text: 'Outdoor Running' },
  { id: 3, text: 'Outdoor Cycling' },
  { id: 4, text: 'Rope Skipping' },
  { id: 5, text: 'Swimming' },
  { id: 6, text: 'Yoga' },
  { id: 7, text: 'Dance' },
  { id: 8, text: 'Mountaineering' },
  { id: 9, text: 'Badminton' },
  { id: 10, text: 'Basketball' },
];


const WorkoutList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const flatListRef = useRef(null);
  const router = useRouter(); // Initialize router

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };
  
  // 💡 NAVIGATION FUNCTION
  const handleStartWorkout = (workoutName) => {
    router.push({
      pathname: "/WorkoutDetails", // Ensure this path matches your file structure
      params: { workoutName: workoutName }
    });
  };

  // Renders each carousel item
  const renderItem = ({ item }) => {
    return (
        // 💡 WRAP IN TOUCHABLEOPACITY TO MAKE IT INTERACTIVE
        <TouchableOpacity 
            style={[styles.slideContainer, { backgroundColor: theme.cardBackground || theme.background }]}
            onPress={() => handleStartWorkout(item.text)} // Pass the workout name to the handler
        >
            <Text style={[styles.text, { color: theme.text }]}>{item.text}</Text>
            <Text style={[styles.indexText, { color: theme.textSecondary || theme.text }]}>{item.id} / {data.length}</Text>
            {/* Added a hint for the user */}
            <Text style={[styles.tapText, { color: theme.tint }]}>Tap to Start</Text>
        </TouchableOpacity>
    );
  };

  const renderPagination = () => {
    return (
        <View style={styles.paginationContainer}>
            {data.map((_, index) => {
                const isActive = activeIndex === index;
                const dotStyle = [
                    styles.dot,
                    { backgroundColor: theme.textSecondary || 'rgba(52, 73, 94, 0.3)' },
                    isActive && [
                        styles.activeDot,
                        { backgroundColor: theme.tint || '#3498db' }
                    ],
                ];
                return <View key={index} style={dotStyle} />;
            })}
        </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
        <View style={styles.workoutWrapper}>
            <ThemedText title={true} style={styles.title}> Workout </ThemedText>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/addWorkout")}>
                <Ionicons
                    size={35}
                    color={theme.iconColor}
                    name={'add-circle-sharp'} 
                />
            </TouchableOpacity>
        </View>

        <View style={styles.appContainer}>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />
            {renderPagination()}
        </View>
    </ThemedView>
  );
};

export default WorkoutList;

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
    },
    iconButton: {
        borderRadius: 5,
        paddingRight: 25,
        marginTop: 50,
    },
    appContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    slideContainer: {
        width: width,
        height: 120, // Increased height for better tap target
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginVertical: 10,
        borderRadius: 15, // More rounded corners
        paddingVertical: 20,
    },
    text: {
        fontSize: 28, // Larger font
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5,
    },
    indexText: {
        fontSize: 16,
        opacity: 0.7,
    },
    tapText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 5, // Positioned at the bottom of the flatlist area
        alignSelf: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
