import { FC, ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import colors from '@utils/colors';

interface Props {
  size?: number;
  ignoreContainer?: boolean;
  onPress?: () => void;
  children: ReactNode;
  onHaptic?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PlayerController: FC<Props> = ({
  size = 45,
  onPress,
  children,
  onHaptic,
  ignoreContainer,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withTiming(0.88, { duration: 90 });
        opacity.value = withTiming(0.65, { duration: 90 });
        translateY.value = withTiming(1, { duration: 90 });
        onHaptic?.();
      }}
      onPressOut={() => {
        scale.value = withSpring(1, {
          stiffness: 420,
          damping: 18,
          mass: 0.5,
        });
        opacity.value = withTiming(1, { duration: 120 });
        translateY.value = withTiming(0, { duration: 120 });
      }}
      onPress={onPress}
      style={[
        styles.pressable,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: ignoreContainer ? 'transparent' : colors.CONTRAST,
        },
      ]}
    >
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlayerController;
