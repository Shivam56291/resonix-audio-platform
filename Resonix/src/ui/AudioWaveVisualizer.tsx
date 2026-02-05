import { FC, useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  playing: boolean;
}

const AudioWaveVisualizer: FC<Props> = ({ playing }) => {
  const animationRef = useRef<LottieView>(null);
  const { width } = useWindowDimensions();

  // responsive sizing
  const waveWidth = width * 0.85;
  const waveHeight = Math.min(80, width * 0.5);

  useEffect(() => {
    if (playing) {
      animationRef.current?.play();
    } else {
      animationRef.current?.pause();
    }
  }, [playing]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(playing ? 1 : 0.4),
    transform: [{ scale: withSpring(playing ? 1 : 0.95) }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LottieView
        ref={animationRef}
        source={require('../../assets/lottie/MusicSoundEqualizer.json')}
        loop
        style={{
          width: waveWidth,
          height: waveHeight,
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
});

export default AudioWaveVisualizer;
