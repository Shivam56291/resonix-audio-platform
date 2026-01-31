import { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import colors from 'utils/colors';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface Props {
  delay: number;
  height: number;
}

const AnimatedStroke: FC<Props> = ({ delay, height }) => {
  const sharedHeight = useSharedValue(height / 2);
  const sharedOpacity = useSharedValue(0.7);

  const animatedStyle = useAnimatedStyle(() => ({
    height: sharedHeight.value,
    opacity: sharedOpacity.value,
  }));

  useEffect(() => {
    sharedHeight.value = withDelay(
      delay,
      withRepeat(
        withTiming(height, {
          duration: 500,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );

    sharedOpacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [delay, height, sharedHeight, sharedOpacity]);

  return (
    <AnimatedLinearGradient
      colors={[colors.SECONDARY + 'dd', colors.SECONDARY + '66']}
      style={[styles.stroke, animatedStyle]}
    />
  );
};

const styles = StyleSheet.create({
  stroke: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
    shadowColor: colors.SECONDARY + 'aa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default AnimatedStroke;
