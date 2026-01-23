import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ReactNode, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

import colors from '@utils/colors';

interface Props<T> {
  data: readonly T[];
  visible?: boolean;
  title?: string;
  renderItem: (item: T) => ReactNode;
  onSelect?: (item: T, index: number) => void;
  onRequestClose?: () => void;
}

const CategorySelector = <T extends any>({
  data = [],
  visible,
  title,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const translateY = useRef(new Animated.Value(40)).current;
  const [showModal, setShowModal] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const handleSelect = (item: T, index: number) => {
    setSelectedIndex(index);
    onSelect?.(item, index);
    onRequestClose?.();
  };

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 120,
          mass: 0.5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 40,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShowModal(false));
    }
  }, [visible, backdropOpacity, contentOpacity, translateY]);

  return (
    <Modal visible={showModal} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents="auto"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
              opacity: contentOpacity,
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <ScrollView>
            {data.map((item, index) => (
              <Pressable
                android_ripple={{ color: colors.SECONDARY }}
                onPress={() => handleSelect(item, index)}
                key={index}
                style={({ pressed }) => [
                  styles.selectorContainer,
                  pressed && styles.pressed,
                ]}
              >
                {selectedIndex === index ? (
                  <MaterialCommunityIcons
                    name="radiobox-marked"
                    color={colors.SECONDARY}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="radiobox-blank"
                    color={colors.SECONDARY}
                  />
                )}
                {renderItem(item)}
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '50%',
    backgroundColor: colors.CONTRAST,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: colors.SECONDARY + '40',
    borderRadius: 6,
  },
});

export default CategorySelector;
