import React, { useRef, useCallback, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
// Assuming 'Link' is imported from your router (e.g., 'expo-router' or '@react-navigation/native')
import { Link } from 'expo-router'; // **ADJUST THIS IMPORT FOR YOUR ROUTER**

const AnimatedLink = Animated.createAnimatedComponent(Link);

/**
 * Wraps content, provides a press transition (opacity fade), and handles navigation.
 *
 * @param {string} href - The navigation target.
 * @param {React.ReactNode} children - The content (e.g., your <ThemedCard>).
 */
const LinkWithTransition = ({ href, children }) => {
  // 1. Animated Value: (0 = default, 1 = pressed)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- Animation Handlers ---

  const fadeIn = useCallback(() => {
    // Transition to 1 (low opacity state)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 850,
      useNativeDriver: true, // Opacity is performant and can use the native driver
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    // Transition back to 0 (default opacity)
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // --- Style Interpolation ---

  // 2. Interpolate: Map 0-1 to the opacity range (e.g., 1 to 0.7)
  const animatedOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.7], // Default opacity (1) -> Pressed opacity (0.7)
  });

  // 3. Animated Style: Memoize the final style object
  const animatedStyle = useMemo(() => ({
    opacity: animatedOpacity,
  }), [animatedOpacity]);

  return (
    // We use the AnimatedLink component and pass style to it
    <AnimatedLink
      href={href}
      style={animatedStyle} // Apply the animated opacity here
      onPressIn={fadeIn}    // Start transition when touch begins
      onPressOut={fadeOut}  // Start transition when touch ends
    >
      {children}
    </AnimatedLink>
  );
};

// You can keep an empty stylesheet here or remove it if not needed
const styles = StyleSheet.create({});

export default LinkWithTransition;