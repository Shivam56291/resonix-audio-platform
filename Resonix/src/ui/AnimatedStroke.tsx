import colors from '@utils/colors';
import {FC, useEffect} from 'react';
import { StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  delay: number;
  height: number;
}

const AnimatedStroke: FC<Props> = ({delay, height}) => {
  const sharedValue = useSharedValue(height/2);

  const heightStyle = useAnimatedStyle(() => ({
    height: sharedValue.value,
  }));

  useEffect(() => {
    sharedValue.value = withDelay(
      delay,
      withRepeat(withTiming(height, {duration: 400}), -1, true),
    );
  }, [delay, height, sharedValue]);

  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

const styles = StyleSheet.create({
  stroke: {
    width: 4,
    backgroundColor: colors.CONTRAST,
    marginRight: 5,
    borderRadius: 1.5,
  },
});

export default AnimatedStroke;
