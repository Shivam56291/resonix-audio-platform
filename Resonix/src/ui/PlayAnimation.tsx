import { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedStroke from './AnimatedStroke';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  visible: boolean;
}

const PlayAnimation: FC<Props> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.1)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.strokeContainer}>
        <AnimatedStroke height={14} delay={0} />
        <AnimatedStroke height={18} delay={120} />
        <AnimatedStroke height={16} delay={240} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  strokeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
  },
});

export default PlayAnimation;
