import { FC, useEffect } from 'react';
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

  useEffect(() => {
    scale.value = withSpring(playing ? 1 : 0.85, {
      damping: 10,
      stiffness: 250,
      mass: 0.5,
    });
  }, [playing, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(playing ? 1 : 0.9, {
            damping: 12,
            stiffness: 220,
          });
        }}
        onPress={onPress}
        style={[
          styles.iconButton,
          {
            backgroundColor: bgColor,
            width: size + 12,
            height: size + 12,
            borderRadius: (size + 12) / 2,
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
});

export default PlayPauseBtn;
