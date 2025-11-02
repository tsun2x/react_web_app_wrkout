import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../constants/Colors'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    console.log("Current color scheme:", colorScheme);
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
        name="(home_page)" 
        options={{ 
          headerShown: false// Hides the header that shows the folder name
        }} 
      />
      <Stack.Screen 
        name="(workout)" 
        options={{ 
          headerShown: false// Hides the header that shows the folder name
        }} />
      <Stack.Screen 
        name="(workout_plan)" 
        options={{ 
          headerShown: false
        }} />
      
      
    </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})