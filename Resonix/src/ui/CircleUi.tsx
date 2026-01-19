import { FC } from 'react';
import { FlexStyle, View, ViewStyle } from 'react-native';
import colors from '@utils/colors';

interface Props {
  size: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CircleUi: FC<Props> = ({ size, position = 'top-left' }) => {
  let viewPosition: FlexStyle = {};

  switch (position) {
    case 'top-left':
      viewPosition = { top: -size / 2, left: -size / 2 };
      break;
    case 'top-right':
      viewPosition = { top: -size / 2, right: -size / 2 };
      break;
    case 'bottom-left':
      viewPosition = { bottom: -size / 2, left: -size / 2 };
      break;
    case 'bottom-right':
      viewPosition = { bottom: -size / 2, right: -size / 2 };
      break;
    default:
      viewPosition = { top: 0, left: 0 };
  }

  const circlePatternStyle: ViewStyle = {
    position: 'absolute',
    ...viewPosition,
    width: size,
    height: size,
  };

  const bigCircleStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.SECONDARY,
    opacity: 0.3,
  };

  const smallCircleStyle: ViewStyle = {
    width: size / 1.5,
    height: size / 1.5,
    borderRadius: size / 2,
    backgroundColor: colors.SECONDARY,
    opacity: 0.3,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -size / 3 }, { translateY: -size / 3 }],
  };

  return (
    <View style={circlePatternStyle}>
      <View style={bigCircleStyle} />
      <View style={smallCircleStyle} />
    </View>
  );
};

export default CircleUi;
