import { FC, useEffect, useState } from 'react';
import {
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

  const handleOnPress = () => {
    setExpanded(prev => {
      const next = !prev;
      width.value = withTiming(next ? selectorSize * speedRates.length : 0, {
        duration: 140,
      });
      scale.value = withSpring(next ? 1 : 0.95, {
        damping: 14,
        stiffness: 180,
      });
      opacity.value = withTiming(next ? 1 : 0, { duration: 120 });
      return next;
    });
  };

  const widthStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));
  const containerStyleAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {!expanded && (
        <Pressable onPress={handleOnPress}>
          <FontAwesome5Icon name="running" size={24} color={colors.CONTRAST} />
        </Pressable>
      )}

      {expanded && (
        <Animated.View style={[styles.buttons, widthStyle, containerStyleAnim]}>
          {speedRates.map((rate, index) => {
            return (
              <Selector
                key={index}
                value={rate}
                onPress={() => {
                  hapticLight();
                  onPress?.(+rate);
                  setExpanded(false);

                  width.value = withTiming(0, { duration: 120 });
                  opacity.value = withTiming(0, { duration: 100 });
                  scale.value = withSpring(0.95);
                }}
                active={activeRate === rate}
              />
            );
          })}
        </Animated.View>
      )}
    </View>
  );
};

interface SelectorProps {
  value: string;
  active?: boolean;
  onPress?: () => void;
}

const Selector: FC<SelectorProps> = ({ value, active, onPress }) => {
  const activeScale = useSharedValue(active ? 1.05 : 1);

  const styleAnim = useAnimatedStyle(() => ({
    transform: [{ scale: activeScale.value }],
  }));

  useEffect(() => {
    activeScale.value = withTiming(active ? 1.05 : 1, { duration: 120 });
  }, [active, activeScale]);

  return (
    <Animated.View style={styleAnim}>
      <Pressable
        onPress={onPress}
        style={[
          styles.selector,
          {
            backgroundColor: active ? colors.SECONDARY : undefined,
          },
        ]}
      >
        <Text
          style={[
            styles.selectorText,
            { fontWeight: active ? '700' : undefined },
          ]}
        >
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
