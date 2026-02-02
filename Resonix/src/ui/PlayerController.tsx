import { FC, ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import colors from '@utils/colors';

interface Props {
  size?: number;
  ignoreContainer?: boolean;
  onPress?: () => void;
  children: ReactNode;
}

const PlayerController: FC<Props> = ({
  size = 45,
  onPress,
  children,
  ignoreContainer,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressableStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: ignoreContainer ? 'transparent' : colors.CONTRAST,
        },
        pressed && !ignoreContainer && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.93 }],
  },
});

export default PlayerController;
