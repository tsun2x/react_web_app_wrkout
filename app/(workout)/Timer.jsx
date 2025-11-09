import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';

const { height, width } = Dimensions.get('window');

// Calculation Constants
const MS_PER_METER = 3000; 
const MS_PER_CALORIE = 10000; 
const PAUSE_DURATION_MS = 2000; 

// --- Utility Functions ---

// Helper to format milliseconds into HH:MM:SS format
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => (num < 10 ? '0' : '') + num;
    
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// Helper Component for Metrics Display
// 🚀 DESIGN FIX: Restructured for column layout (Icon, Value, Label)
const MetricBox = ({ label, value, icon, theme }) => (
    <View style={[styles.metricBox, { backgroundColor: theme.cardBackground }]}>
        <Ionicons 
            name={icon} 
            size={36} // Larger icon
            color={theme.tint} 
            style={styles.metricIconColumn} // Applied new column style
        />
        <ThemedText style={styles.metricValueColumn}>{value}</ThemedText>
        <ThemedText style={[styles.metricLabelColumn, { color: theme.textSecondary }]}>
            {label}
        </ThemedText>
    </View>
);

// Confirmation Modal Component - REVISED
const ConfirmWorkoutModal = ({ theme, onConfirm, onCancel }) => ( // Removed 'results' prop
    <View style={[modalStyles.overlay, { backgroundColor: theme.overlay || 'rgba(0,0,0,0.7)' }]}>
        <View style={[modalStyles.container, { backgroundColor: theme.cardBackground }]}>
            <ThemedText style={modalStyles.title}>Workout Paused</ThemedText>
            
            {/* Removed the Duration and Calories display */}
            
            <ThemedText style={modalStyles.question}>
                Do you want to end the workout or resume?
            </ThemedText>
            
            <View style={modalStyles.buttonGroup}>
                <TouchableOpacity
                    style={[modalStyles.button, { backgroundColor: theme.error, marginRight: 10 }]}
                    onPress={onConfirm} 
                >
                    {/* 🚀 FIXED: Wrapped in <Text> */}
                    <Text style={modalStyles.buttonText}>End Workout</Text> 
                </TouchableOpacity>
                <TouchableOpacity
                    style={[modalStyles.button, { backgroundColor: theme.tint }]}
                    onPress={onCancel} 
                >
                    {/* 🚀 FIXED: Wrapped in <Text> */}
                    <Text style={modalStyles.buttonText}>Resume Workout</Text> 
                </TouchableOpacity>
            </View>
        </View>
    </View>
);


const Timer = ({ workoutName, onWorkoutEnd }) => { 
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0); 
    const [isPausing, setIsPausing] = useState(false); 
    const [showModal, setShowModal] = useState(false); 
    const timerRef = useRef(null);
    const progressAnim = useRef(new Animated.Value(0)).current; 

    // Calculated state
    const distanceKm = (timeElapsed / MS_PER_METER / 1000).toFixed(2);
    const caloriesBurned = Math.floor(timeElapsed / MS_PER_CALORIE);
    
    // Results object is now local, used only for current metrics display
    const finalResults = {
        workoutName,
        timeElapsed,
        duration: formatTime(timeElapsed),
        calories: caloriesBurned,
    };

    // Main Timer Effect
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(prevTime => prevTime + 100);
            }, 100);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    // Long Press Pause Effect
    useEffect(() => {
        if (isPausing) {
            if (progressAnim && progressAnim.setValue) {
                progressAnim.setValue(0);
                Animated.timing(progressAnim, {
                    toValue: 1, 
                    duration: PAUSE_DURATION_MS,
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        setIsPausing(false);
                        setShowModal(true); 
                    }
                });
            }
        } else {
            if (progressAnim && typeof progressAnim.stop === 'function') {
                progressAnim.stop(); 
                progressAnim.setValue(0);
            }
        }
    }, [isPausing, progressAnim]); 

    // 🌟 FIX 1: Revised Logic for playing/pausing/resuming (short press)
    const handleStartPause = () => {
        // Only allow short press to toggle if we are NOT in the middle of a long-press sequence
        if (!isPausing) {
            setIsRunning(prevIsRunning => !prevIsRunning);
        }
    };
    
    // Logic for long press start (starts loading)
    const handleLongPress = () => {
        if (isRunning) {
            setIsRunning(false); 
            setIsPausing(true); 
        }
    };
    
    // Logic for finger lift before loading completion (resumes)
    const handlePressOut = () => {
        if (isPausing) {
            if (progressAnim && progressAnim._value < 1) { 
                setIsPausing(false);
                setIsRunning(true); 
            }
        }
    };

    // Handle Stop, called by Modal's "End Workout"
    const handleStop = () => {
        setShowModal(false); 
        // CRITICAL: Now calls onWorkoutEnd() without results.
        if (onWorkoutEnd) {
            onWorkoutEnd();
        }
        setTimeElapsed(0); 
    };

    // Handle Cancel/Resume, called by Modal's "Resume Workout"
    const handleCancel = () => {
        setShowModal(false); 
        setIsRunning(true); 
    };
    
    // Determine the button icon based on state
    let buttonIconName = 'play';
    // If running or in the long-press sequence, show pause icon
    if (isRunning || isPausing) { 
        buttonIconName = 'pause';
    }
    
    // Interpolate progress animation to width for the bar
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });


    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
            <ThemedText title={true} style={styles.workoutNameText}>
                {workoutName}
            </ThemedText>

            {/* Main Timer Display */}
            <View style={[styles.timerCircle, { borderColor: theme.tint, backgroundColor: theme.cardBackground }]}>
                <ThemedText style={styles.timerText}>
                    {formatTime(timeElapsed)}
                </ThemedText>
            </View>

            {/* Metrics */}
            <View style={styles.metricsContainer}>
                <MetricBox 
                    label="Distance (KM)" 
                    value={distanceKm} 
                    icon="walk" 
                    theme={theme} 
                />
                <MetricBox 
                    label="Calories (KCAL)" 
                    value={caloriesBurned} 
                    icon="flame" 
                    theme={theme} 
                />
            </View>
            
            {/* Control Buttons - Fixed Alignment */}
            <View style={styles.controlWrapper}>
                
                {/* Stop Button - Triggers immediate stop and modal */}
                {timeElapsed > 0 && (
                    <TouchableOpacity 
                        style={[styles.stopButtonAbsolute, { backgroundColor: theme.error }]} 
                        onPress={() => {
                            setIsRunning(false); 
                            setIsPausing(false);
                            if (progressAnim && typeof progressAnim.stop === 'function') {
                                progressAnim.stop(); 
                            }
                            setShowModal(true); 
                        }}
                    >
                        <Ionicons name="stop" size={45} color="white" />
                    </TouchableOpacity>
                )}

                {/* Start/Pause Button (Primary action) */}
                <TouchableOpacity 
                    style={[styles.startPauseButton, { 
                        backgroundColor: isRunning ? theme.secondary : theme.tint,
                        opacity: isPausing ? 0.7 : 1, 
                    }]} 
                    // 🌟 FIX 2: Call the corrected handleStartPause
                    onPress={handleStartPause} 
                    onLongPress={handleLongPress} 
                    onPressOut={handlePressOut}
                    disabled={showModal}
                >
                    <Ionicons 
                        name={buttonIconName} 
                        size={45} 
                        color="white" 
                        style={buttonIconName === 'play' ? { paddingLeft: 5 } : {}} 
                    />
                    
                    {/* Long Press Progress Bar Overlay */}
                    {isPausing && (
                        <View style={styles.progressBarBackground}>
                             <Animated.View style={[
                                 styles.progressBar, 
                                 { width: progressWidth, backgroundColor: theme.tint, opacity: 0.8 }
                             ]} />
                             <ThemedText style={styles.pauseText}>PAUSE</ThemedText>
                        </View>
                    )}
                </TouchableOpacity>

            </View>
            
            {/* Confirmation Modal - Simplified */}
            {showModal && (
                <ConfirmWorkoutModal 
                    theme={theme} 
                    onConfirm={handleStop}
                    onCancel={handleCancel}
                />
            )}
        </ThemedView>
    );
};

export default Timer;


// --- Styles ---

// Styles for the Modal Component - REVISED
const modalStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        maxWidth: 400,
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    // dataRow and icon styles are now redundant but kept for other uses if needed
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        paddingLeft: 30,
    },
    icon: {
        marginRight: 10,
    },
    dataText: {
        fontSize: 16,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10, // Adjusted margin
        marginBottom: 25, // Adjusted margin
        textAlign: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        padding: 10,
        width:100
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    workoutNameText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timerCircle: {
        width: 250,
        height: 240,
        borderRadius: 125,
        borderWidth: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '200',
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    // 🚀 METRIC BOX DESIGN UPDATES FOR COLUMN LAYOUT
    metricBox: {
        width: '45%',
        borderRadius: 15,
        padding: 20, 
        alignItems: 'center', // Centers contents horizontally (Icon, Value, Label)
        justifyContent: 'space-between', 
        minHeight: 120, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2, 
        shadowRadius: 5,
        elevation: 6,
    },
    metricRow: { // DEPRECATED: This was for the previous row layout. Keeping it empty.
        // Removed flexDirection: 'row'
    },
    metricIconColumn: { // NEW: For the icon at the top of the column
        marginBottom: 5,
        marginTop: 5,
    },
    metricValueColumn: { // NEW: For the large number
        fontSize: 32, 
        fontWeight: 'bold',
        marginBottom: 2,
    },
    metricLabelColumn: { // NEW: For the text label at the bottom
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    // 🚀 END METRIC BOX DESIGN UPDATES
    controlWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,
        top: 20
    },
    startPauseButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        borderWidth: 5,
        overflow: 'hidden', 
    },
    stopButtonAbsolute: {
        position: 'absolute',
        left: '7%',
        top: 15,
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Styles for Long Press Loading
    progressBarBackground: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    pauseText: {
        position: 'absolute',
        color: 'white', 
        fontSize: 14,
        fontWeight: 'bold',
        zIndex: 1,
    }
});