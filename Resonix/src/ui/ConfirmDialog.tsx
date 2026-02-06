import { FC, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, Pressable } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import colors from '@utils/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const FAST_SPRING = {
  damping: 20,
  stiffness: 380,
  mass: 0.35,
};

const ConfirmDialog: FC<Props> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  onConfirm,
  onCancel,
}) => {
  const cancelScale = useSharedValue(1);
  const confirmScale = useSharedValue(1);
  const dialogScale = useSharedValue(0.96);

  const cancelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelScale.value }],
    opacity: cancelScale.value < 1 ? 0.7 : 1,
  }));

  const confirmStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confirmScale.value }],
    opacity: confirmScale.value < 1 ? 0.7 : 1,
  }));

  const dialogStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dialogScale.value }],
  }));

  useEffect(() => {
    if (visible) {
      dialogScale.value = withSpring(1, {
        damping: 18,
        stiffness: 420,
        mass: 0.4,
      });
    }
  }, [visible, dialogScale]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.1)"
        />
        <Animated.View style={[styles.card, dialogStyle]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Animated.View style={cancelStyle}>
              <Pressable
                onPressIn={() =>
                  (cancelScale.value = withSpring(0.94, FAST_SPRING))
                }
                onPressOut={() =>
                  (cancelScale.value = withSpring(1, FAST_SPRING))
                }
                onPress={onCancel}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={confirmStyle}>
              <Pressable
                onPressIn={() =>
                  (confirmScale.value = withSpring(0.94, FAST_SPRING))
                }
                onPressOut={() =>
                  (confirmScale.value = withSpring(1, FAST_SPRING))
                }
                onPress={onConfirm}
                style={styles.dangerBtn}
              >
                <Text style={styles.dangerText}>{confirmText}</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: colors.PRIMARY,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.SECONDARY,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: {
    color: colors.SECONDARY,
    fontWeight: '600',
  },
  dangerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  dangerText: {
    color: '#ff6b6b',
    fontWeight: '700',
  },
});

export default ConfirmDialog;
