import { FC, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import colors from '@utils/colors';

interface Props {
  color?: string;
  size?: number;
}

const Loader: FC<Props> = ({ color = colors.CONTRAST, size = 24 }) => {
  const initialRotation = useSharedValue(0);

  const transform = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: initialRotation.value + 'deg',
        },
      ],
    };
  });

  useEffect(() => {
    initialRotation.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
      false,
    );
  }, [initialRotation]);

  return (
    <Animated.View style={transform}>
      <Feather name="loader" size={size} color={color} />
    </Animated.View>
  );
};

export default Loader;
