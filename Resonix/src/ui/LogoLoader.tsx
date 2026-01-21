import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import colors from '@utils/colors';

interface Props {
  logo: any; // logo image source
  size?: number;
  fadeOut?: boolean;
  duration?: number;
}

const LogoLoader: React.FC<Props> = ({ logo, size = 120, fadeOut = false, duration = 400 }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const glow = useSharedValue(0); // glow pulse
  const containerOpacity = useSharedValue(1);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1 + glow.value * 0.5 }], // subtle pulse
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  useEffect(() => {
    // Fade-in and scale bounce
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });

    // Glow pulse
    glow.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [glow, opacity, scale]);

  useEffect(() => {
    if (fadeOut) {
      containerOpacity.value = withTiming(0, { duration });
    }
  }, [fadeOut, duration, containerOpacity]);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Glowing aura */}
      <Animated.View style={[styles.glowContainer, glowStyle]}>
        <LinearGradient
          colors={[colors.SECONDARY + '55', colors.SECONDARY + '00']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Logo */}
      <Animated.Image
        source={logo}
        style={[{ width: size, height: size }, logoStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
  },
});

export default LogoLoader;
