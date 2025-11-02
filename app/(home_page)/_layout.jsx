import { Stack } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';


export default function HomeLayout() {
  const colorScheme = useColorScheme()
  console.log("Current color scheme:", colorScheme);
  const theme = Colors[colorScheme] ?? Colors.light

  return (
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
            name='weightCard'
            options={ {title: 'Weight'}}
        />
        <Stack.Screen 
            name='healthTips'
            options={ {title: 'Health Tips'}}
        />
        <Stack.Screen 
            name='nutritionAdvice'
            options={ {title: 'Nutrition Advice'}}
        />
    </Stack>
  );
}

const styles = StyleSheet.create({
  
})