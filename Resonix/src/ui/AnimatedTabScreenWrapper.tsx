import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

const AnimatedTabScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  const isFocused = useIsFocused();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 10 },
    ],
  }));

  return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>;
};

export default AnimatedTabScreenWrapper;
