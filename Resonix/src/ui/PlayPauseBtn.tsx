import { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '@utils/colors';

interface Props {
  color?: string;
  size?: number;
  playing?: boolean;
  onPress?: () => void;
}

const PlayPauseBtn: FC<Props> = ({
  color = colors.CONTRAST,
  size = 24,
  playing,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      onPress={onPress}
    >
      {playing ? (
        <Ionicons name="pause" size={size} color={color} />
      ) : (
        <Ionicons name="play" size={size} color={color} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.6,
  },
});

export default PlayPauseBtn;
