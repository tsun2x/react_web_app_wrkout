import React, { useRef, useCallback, useMemo } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Reusable wrapper component that applies a smooth opacity transition to its children
 * when pressed, and executes a passed-in function (onCardPress) afterwards.
 *
 * @param {function} onCardPress - The function (e.g., router.push(href)) to execute after the animation.
 * @param {React.ReactNode} children - The card content.
 */
const CardWithTransition = ({ onCardPress, children }) => {
  // Animated Value: (0 = default, 1 = pressed state)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- Animation Handlers ---
  const fadeIn = useCallback(() => {
    // 1. 🟢 RESTORED: Transition to 1 (low opacity state)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true, 
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // 🚀 Call the prop function AFTER the animation completes
      if (onCardPress) {
        onCardPress(); 
      }
    });
  }, [fadeAnim, onCardPress]); 

  // --- Style Interpolation ---

  // 2. 🟢 RESTORED: Map 0-1 to the opacity range (1 to 0.7)
  const animatedOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.7], // Default opacity (1) -> Pressed opacity (0.7)
  });

  // Memoize the final style object
  const animatedStyle = useMemo(() => ({
    opacity: animatedOpacity,
  }), [animatedOpacity]);

  return (
    <AnimatedPressable
      // Use onPressIn/onPressOut to manage the animation sequence
      onPressIn={fadeIn}         
      onPressOut={fadeOut}       
      style={[animatedStyle, styles.pressableWrapper]}
    >
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  // This style is important to ensure the Pressable covers and wraps the card content correctly
  pressableWrapper: {
    // Allows the animated pressable to take the size of its content
    alignSelf: 'stretch', 
  }
});

export default CardWithTransition;