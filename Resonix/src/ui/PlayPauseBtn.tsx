import { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import colors from '@utils/colors';

interface Props {
  color?: string;
  size?: number;
  playing?: boolean;
  onPress?: () => void;
  bgColor?: string;
}

const PlayPauseBtn: FC<Props> = ({
  color = colors.CONTRAST,
  size = 24,
  playing,
  bgColor = colors.CONTRAST,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.9))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={[
          styles.iconButton,
          {
            backgroundColor: bgColor,
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
          },
        ]}
      >
        {playing ? (
          <Ionicons name="pause" size={size} color={color} />
        ) : (
          <Ionicons
            name="play"
            size={size}
            color={color}
            style={{ marginLeft: size * 0.14 }}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.6,
  },
});

export default PlayPauseBtn;
