import { ReactNode, useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

import BasicModalContainer from 'ui/BasicModalContainer';

interface Props<T> {
  visible: boolean;
  onRequestClose: () => void;
  options: T[];
  renderItem: (item: T) => ReactNode;
}

const OptionsModal = <T extends any>({
  visible,
  onRequestClose,
  options,
  renderItem,
}: Props<T>) => {

  const translateY = useRef(new Animated.Value(16)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
  if (visible) {
    translateY.setValue(16);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [visible,opacity,translateY]);


return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
        }}
      >
        {options.map((item, index) => (
          <View key={index}>{renderItem(item)}</View>
        ))}
      </Animated.View>
    </BasicModalContainer>
  );
};

export default OptionsModal;
