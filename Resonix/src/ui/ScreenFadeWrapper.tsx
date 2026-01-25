import { ReactNode } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  children: ReactNode;
}

const ScreenFadeWrapper = ({ children }: Props) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(15);
  const scale = useSharedValue(0.98);

  useFocusEffect(() => {
    // Animate in
    opacity.value = withTiming(1, { duration: 180 }); // fast fade
    translateY.value = withSpring(0, { damping: 10, stiffness: 250, mass: 0.4 }); // snappy slide
    scale.value = withSpring(1, { damping: 10, stiffness: 250, mass: 0.4 }); // subtle pop

    // Animate out on blur
    return () => {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(15, { duration: 150 });
      scale.value = withTiming(0.98, { duration: 150 });
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default ScreenFadeWrapper;
