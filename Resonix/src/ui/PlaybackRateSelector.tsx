import { FC, useState } from 'react';
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
  withTiming,
} from 'react-native-reanimated';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import colors from 'utils/colors';

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
  const [showButton, setShowButton] = useState(true);
  const width = useSharedValue(0);

  const handleOnPress = () => {
    setShowButton(prev => {
      const next = !prev;
      width.value = withTiming(next ? selectorSize * speedRates.length : 0, {
        duration: 120,
      });
      return next;
    });
  };

  const widthStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {showButton && (
        <Pressable onPress={handleOnPress}>
          <FontAwesome5Icon name="running" size={24} color={colors.CONTRAST} />
        </Pressable>
      )}
      <Animated.View style={[styles.buttons, widthStyle]}>
        {speedRates.map((rate, index) => {
          return (
            <Selector
              key={index}
              value={rate}
              onPress={() => onPress?.(+rate)}
              active={activeRate === rate}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

interface SelectorProps {
  value: string;
  active?: boolean;
  onPress?: () => void;
}

const Selector: FC<SelectorProps> = ({ value, active, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selector,
        {
          backgroundColor: active ? colors.SECONDARY : undefined,
        },
      ]}
    >
      <Text style={styles.selectorText}>{value}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttons: {
    flexDirection: 'row',
    backgroundColor: colors.OVERLAY,
    overflow: 'hidden',
    alignSelf: 'center',
    
  },
  selector: {
    width: selectorSize,
    height: selectorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    color: colors.CONTRAST,
  },
});

export default PlaybackRateSelector;
