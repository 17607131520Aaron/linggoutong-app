import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

export const useRegisterBackgroundAnimations = () => {
  const glowAnim = useMemo(() => new Animated.Value(0), []);
  const gridAnim = useMemo(() => new Animated.Value(0), []);

  const glow1TranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-40, 30] });
  const glow1TranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [10, -20] });
  const glow2TranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -30] });
  const glow2TranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 25] });
  const gridTranslateY = gridAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -28] });

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 6800,
        useNativeDriver: true,
      }),
    );
    const gridLoop = Animated.loop(
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      }),
    );
    glowLoop.start();
    gridLoop.start();
    return () => {
      glowLoop.stop();
      gridLoop.stop();
    };
  }, [glowAnim, gridAnim]);

  return {
    glow1TranslateX,
    glow1TranslateY,
    glow2TranslateX,
    glow2TranslateY,
    gridTranslateY,
  };
};
