import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { useDispatch, useSelector } from 'react-redux';
import {
  getNotificationState,
  updateNotification,
} from 'src/store/notification';
import colors from '@utils/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {}

const AppNotification: React.FC<Props> = () => {
  const { message, type } = useSelector(getNotificationState);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets(); // get top inset


  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);

  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const backgroundColor = type === 'success' ? colors.SUCCESS : colors.ERROR;
  const textColor = colors.CONTRAST;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (!message) {
      // Hide the component
      translateY.value = withTiming(-60, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      setVisible(false);
      return;
    }

    setVisible(true);

    // Slide in + fade in
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 300 });

    // Auto dismiss
    timeoutRef.current = setTimeout(() => {
      // Slide out + fade out
      translateY.value = withTiming(-60, { duration: 300, easing: Easing.in(Easing.exp) });
      opacity.value = withTiming(0, { duration: 300 });

      // Use a safe JS effect after animation completes
      setTimeout(() => {
        dispatch(updateNotification({ message: '', type: 'error' }));
        setVisible(false);
      }, 300); // match animation duration
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [message, type, dispatch, translateY, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { backgroundColor, width: SCREEN_WIDTH - 32, top: insets.top + 16 },
      ]}
    >
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppNotification;
