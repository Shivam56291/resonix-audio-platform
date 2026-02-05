import { FC, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import colors from 'utils/colors';
import { hapticLight } from 'utils/haptics';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  activeRate?: string;
  onPress?: (rate: number) => void;
}

const speedRates = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];
const selectorSize = 40;

const PlaybackRateSelector: FC<Props> = ({
  containerStyle,
  activeRate,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const width = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  const toggle = () => setExpanded(prev => !prev);
  const collapse = () => setExpanded(false);

  useEffect(() => {
    if (expanded) {
      width.value = withTiming(selectorSize * speedRates.length, {
        duration: 140,
      });
      scale.value = withSpring(1, {
        damping: 14,
        stiffness: 180,
      });
      opacity.value = withTiming(1, { duration: 120 });
    } else {
      width.value = withTiming(0, { duration: 120 });
      opacity.value = withTiming(0, { duration: 100 });
      scale.value = withSpring(0.95);
    }
  }, [expanded, width, scale, opacity]);

  const widthStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const containerStyleAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <>
      {/* Outside click handler */}
      <Modal visible={expanded} transparent animationType="none">
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.08)' },
          ]}
          onPress={collapse}
        />
      </Modal>

      <View style={[styles.container, containerStyle]}>
        {!expanded && (
          <Pressable onPress={toggle}>
            <FontAwesome5Icon
              name="running"
              size={24}
              color={colors.CONTRAST}
            />
          </Pressable>
        )}

        {expanded && (
          <Animated.View
            style={[styles.buttons, widthStyle, containerStyleAnim]}
          >
            {speedRates.map(rate => (
              <Selector
                key={rate}
                value={rate}
                active={activeRate === rate}
                onPress={() => {
                  hapticLight();
                  onPress?.(+rate);
                  collapse();
                }}
              />
            ))}
          </Animated.View>
        )}
      </View>
    </>
  );
};

interface SelectorProps {
  value: string;
  active?: boolean;
  onPress?: () => void;
}

const Selector: FC<SelectorProps> = ({ value, active, onPress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(active ? 1.05 : 1, {
      duration: 120,
    });
  }, [active, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={[
          styles.selector,
          active && { backgroundColor: colors.SECONDARY },
        ]}
      >
        <Text style={[styles.selectorText, active && { fontWeight: '700' }]}>
          {value}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttons: {
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    overflow: 'hidden',
    alignSelf: 'center',
    height: selectorSize,
    borderRadius: selectorSize / 2,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  selector: {
    width: selectorSize,
    height: selectorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    color: colors.CONTRAST,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default PlaybackRateSelector;
