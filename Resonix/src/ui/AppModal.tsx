import { FC, ReactNode, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import colors from 'utils/colors';

interface Props {
  children: ReactNode;
  visible: boolean;
  onRequestClose: () => void;
  animation?: boolean;
}

const { height } = Dimensions.get('window');

const modalHeight = height - 150;

const AppModal: FC<Props> = ({
  children,
  visible,
  onRequestClose,
  animation,
}) => {
  const translateY = useSharedValue(modalHeight);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const gesture = Gesture.Pan()
    .onUpdate(event => {
      if (event.translationY <= 0) return;

      translateY.value = event.translationY;
    })
    .onFinalize(event => {
      if (event.translationY <= modalHeight / 2) translateY.value = 0;
      else {
        translateY.value = modalHeight;
        runOnJS(onRequestClose)();
      }
    });

  useEffect(() => {
    if (visible)
      translateY.value = withTiming(0, { duration: animation ? 200 : 0 });
  }, [translateY, visible, animation]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable onResponderEnd={onRequestClose} style={styles.backdrop}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modal, translateStyle]}>
              {children}
            </Animated.View>
          </GestureDetector>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  modal: {
    backgroundColor: colors.PRIMARY,
    height: modalHeight,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
});

export default AppModal;
