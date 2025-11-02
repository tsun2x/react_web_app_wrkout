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
const MetricBox = ({ label, value, icon, theme }) => (
    <View style={[styles.metricBox, { backgroundColor: theme.cardBackground }]}>
        <Ionicons name={icon} size={24} color={theme.tint} />
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
        <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>
            {label}
        </ThemedText>
    </View>
);

// Confirmation Modal Component
const ConfirmWorkoutModal = ({ theme, results, onConfirm, onCancel }) => (
    <View style={[modalStyles.overlay, { backgroundColor: theme.overlay || 'rgba(0,0,0,0.7)' }]}>
        <View style={[modalStyles.container, { backgroundColor: theme.cardBackground }]}>
            <ThemedText style={modalStyles.title}>Workout Finished?</ThemedText>
            
            <View style={modalStyles.dataRow}>
                <Ionicons name="timer-outline" size={20} color={theme.text} style={modalStyles.icon} />
                <ThemedText style={modalStyles.dataText}>Duration: {results.duration}</ThemedText>
            </View>
            <View style={modalStyles.dataRow}>
                <Ionicons name="flame-outline" size={20} color={theme.text} style={modalStyles.icon} />
                <ThemedText style={modalStyles.dataText}>Calories: {results.calories} KCAL</ThemedText>
            </View>
            
            <ThemedText style={modalStyles.question}>Do you want to record this data?</ThemedText>
            
            <View style={modalStyles.buttonGroup}>
                <TouchableOpacity
                    style={[modalStyles.button, { backgroundColor: theme.tint, marginRight: 10 }]}
                    onPress={onConfirm}
                >
                    <Text style={modalStyles.buttonText}>Yes, Record</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[modalStyles.button, { backgroundColor: theme.tabBarInactive }]}
                    onPress={onCancel}
                >
                    <Text style={modalStyles.buttonText}>No, Resume</Text>
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
    
    // Results for the modal
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
            // Check if progressAnim is actually an Animated value before using it
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
            // 💡 FIX: Check if .stop is a function before calling it
            if (progressAnim && typeof progressAnim.stop === 'function') {
                progressAnim.stop(); 
                progressAnim.setValue(0);
            }
        }
    }, [isPausing, progressAnim]); // Added progressAnim to dependency array for safety

    // Logic for playing/resuming (short press)
    const handleStartPause = (isLongPress = false) => {
        if (!isRunning && !isLongPress) {
            setIsRunning(true);
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
            // Check if progressAnim has the necessary internal property before access
            if (progressAnim && progressAnim._value < 1) { 
                setIsPausing(false);
                setIsRunning(true); 
            }
        }
    };

    // Handle Stop, called by Modal's "Yes"
    const handleStop = () => {
        setShowModal(false); 
        onWorkoutEnd(finalResults);
        setTimeElapsed(0); 
    };

    // Handle Cancel/Resume, called by Modal's "No"
    const handleCancel = () => {
        setShowModal(false); 
        setIsRunning(true); 
    };
    
    // Determine the button icon based on state
    let buttonIconName = 'play';
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
                            // Also ensure the animation is stopped if it's running
                            if (progressAnim && typeof progressAnim.stop === 'function') {
                                progressAnim.stop(); 
                            }
                            setShowModal(true); 
                        }}
                    >
                        <Ionicons name="stop" size={28} color="white" />
                    </TouchableOpacity>
                )}

                {/* Start/Pause Button (Primary action) */}
                <TouchableOpacity 
                    style={[styles.startPauseButton, { 
                        backgroundColor: isRunning ? theme.secondary : theme.tint,
                        opacity: isPausing ? 0.7 : 1, 
                    }]} 
                    onPress={() => handleStartPause(false)} 
                    onLongPress={handleLongPress} 
                    onPressOut={handlePressOut}
                    disabled={showModal}
                >
                    <Ionicons 
                        name={buttonIconName} 
                        size={35} 
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
            
            {/* Confirmation Modal */}
            {showModal && (
                <ConfirmWorkoutModal 
                    theme={theme} 
                    results={finalResults}
                    onConfirm={handleStop}
                    onCancel={handleCancel}
                />
            )}
        </ThemedView>
    );
};

export default Timer;


// --- Styles ---

// Styles for the Modal Component
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
        marginTop: 20,
        marginBottom: 15,
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
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    workoutNameText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    timerCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
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
        marginBottom: 50,
    },
    metricBox: {
        width: '45%',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    metricValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },
    metricLabel: {
        fontSize: 14,
        marginTop: 5,
    },
    controlWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,
    },
    startPauseButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        overflow: 'hidden', 
    },
    stopButtonAbsolute: {
        position: 'absolute',
        left: '10%',
        top: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 6,
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