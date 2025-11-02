import { Stack } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';


const WorkoutLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <>
            <Stack screenOptions={{
                headerStyle: { backgroundColor: theme.navBackground },
                headerTintColor: theme.title,
                tabBarStyle: {
                    backgroundColor: theme.navBackground,
                    paddingBottom: 5,
                    height: 55,
                },
                tabBarActiveTintColor: theme.iconColorFocused,
                tabBarInactiveTintColor: theme.iconColor,
            }}
            >

                <Stack.Screen
                    name='addWorkout'
                    options={ {title: 'Workout List', headershwon: false}}
                />
                <Stack.Screen
                    name='WorkoutDetails' // 💡 NEW SCREEN ADDED
                    options={ {
                        title: 'Tracker',
                    }}
                />
                <Stack.Screen
                    name='deleteSelectedWorkout' // 💡 NEW SCREEN ADDED
                    options={ {
                        title: 'Delete Workout',
                    }}
                />

            </Stack>
        </>
    )
}

export default WorkoutLayout

const styles = StyleSheet.create({})