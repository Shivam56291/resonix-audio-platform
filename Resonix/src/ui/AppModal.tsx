import {
  ReactNode,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Modal, Pressable, StyleSheet, Dimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';

import colors from 'utils/colors';
import { runOnJS } from 'react-native-worklets';

export interface AppModalRef {
  setPanEnabled: (enabled: boolean) => void;
}

interface Props {
  children: ReactNode;
  visible: boolean;
  onRequestClose: () => void;
}

const { height } = Dimensions.get('window');
const modalHeight = height - 150;

const SPRING = {
  damping: 22,
  stiffness: 220,
  mass: 0.7,
};

const AppModal = forwardRef<AppModalRef, Props>(
  ({ children, visible, onRequestClose }, ref) => {
    const translateY = useSharedValue(modalHeight);
    const backdropOpacity = useSharedValue(0);
    const isGestureEnabled = useSharedValue(true);

    /* ------------------ animated styles ------------------ */

    const modalStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    /* ------------------ open / close ------------------ */

    const openSheet = useCallback(() => {
      backdropOpacity.value = withSpring(1, SPRING);
      translateY.value = withSpring(0, SPRING);
    }, [backdropOpacity, translateY]);

    const closeSheet = useCallback(() => {
      backdropOpacity.value = withSpring(0, SPRING);
      translateY.value = withSpring(modalHeight, SPRING);
    }, [backdropOpacity, translateY]);

    const openSheetWorklet = () => {
      'worklet';
      backdropOpacity.value = withSpring(1, SPRING);
      translateY.value = withSpring(0, SPRING);
    };

    const onCloseComplete = () => {
      onRequestClose?.(); // tell parent modal fully closed
    };

    const closeSheetWorklet = () => {
      'worklet';
      backdropOpacity.value = withSpring(
        0,
        { damping: 18, stiffness: 150 },
        () => {
          runOnJS(onCloseComplete)(); // call parent on JS thread after animation
        },
      );

      translateY.value = withSpring(modalHeight, {
        damping: 18,
        stiffness: 150,
      });
    };

    const closeSheetOnBackdrop = () => {
      backdropOpacity.value = withSpring(0, { damping: 20, stiffness: 160 });
      translateY.value = withSpring(modalHeight, {
        damping: 20,
        stiffness: 160,
      });
    };

    /* ------------------ gesture ------------------ */

    const gesture = Gesture.Pan()
      .activeOffsetY([10, 999])
      .failOffsetX([-10, 10])
      .simultaneousWithExternalGesture(Gesture.Native())
      .onUpdate(event => {
        if (!isGestureEnabled.value) return;
        translateY.value =
          event.translationY < 0
            ? event.translationY * 0.3
            : event.translationY;
      })
      .onEnd(event => {
        if (!isGestureEnabled.value) return;

        const shouldClose =
          event.translationY > modalHeight * 0.25 || event.velocityY > 1200;

        if (shouldClose) closeSheetWorklet();
        else openSheetWorklet();
      });

    /* ------------------ visibility sync ------------------ */

    useEffect(() => {
      if (visible) openSheet();
      else closeSheet();
    }, [visible, closeSheet, openSheet]);

    /* ------------------ imperative handle ------------------ */

    useImperativeHandle(ref, () => ({
      setPanEnabled(enabled: boolean) {
        isGestureEnabled.value = enabled;
      },
    }));

    /* ------------------ render ------------------ */

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeSheetOnBackdrop}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* Backdrop */}
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={0.8}
              reducedTransparencyFallbackColor="black"
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0,0,0,0.2)' },
              ]}
            />
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeSheetWorklet}
            />
          </Animated.View>

          {/* Modal */}
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.modal, modalStyle]}>
              {children}
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modal: {
    backgroundColor: colors.PRIMARY,
    height: modalHeight,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});

export default AppModal;
