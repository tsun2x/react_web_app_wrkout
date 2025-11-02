import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

const ThemedCard = ({ style, children, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <View 
      style={[
        styles.card,
        { backgroundColor: theme.uiBackground },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 20,
    }
})