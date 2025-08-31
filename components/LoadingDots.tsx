import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const Dot = ({ delay = 0 }) => {
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [scale, delay]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          transform: [{ scale }],
        },
      ]}
    />
  );
};

export const LoadingDots = () => {
  return (
    <View style={styles.container}>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "black",
    marginHorizontal: 4,
  },
});
