import React from 'react'
import { useColorScheme } from 'react-native'
import { Tabs } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const TabsLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          paddingTop: 5,
          height: 95,
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor,
      }}
    >
        <Tabs.Screen name="index" 
        options={{ title: 'Home', tabBarIcon: ({ focused }) => (
            <Ionicons 
                size={24}
                color={focused ? theme.iconColorFocused : theme.iconColor}
                name={focused ? "home" : "home-outline"}
            />
        )}} />

        <Tabs.Screen name="workout" 
        options={{ title: 'Workouts', tabBarIcon: ({ focused }) => (
            <Ionicons 
                size={28}
                color={ focused ? theme.iconColorFocused : theme.iconColor }
                name={focused ? "barbell" : "barbell-outline"}
            />
        )}} />

        <Tabs.Screen name="info"
        options={{title: 'Info', tabBarIcon: ({ focused }) => (
      <Ionicons
        size={24}
        color={focused ? theme.iconColorFocused : theme.iconColor}
        name={focused ? "information-circle" : "information-circle-outline"}
      />
    )}}/>
        
    </Tabs>
  )
}

export default TabsLayout