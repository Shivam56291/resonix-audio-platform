import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';

const { width } = Dimensions.get('window');

type AnimatedSplashProps = {
  onFinish: () => void;
  logo?: ImageSourcePropType;
  tagline?: string;
  backgroundColor?: string;
};

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  onFinish,
  logo = require('../../assets/logo.png'),
  tagline = 'Turn moments into sound.',
  backgroundColor = '#121212',
}) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0.9)).current; // subtle bg pulse

  useEffect(() => {
    // Step 1: Fade in background slightly
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Step 2: Animate logo pop & settle
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1.1, // slight overshoot
          stiffness: 120,
          damping: 12,
          mass: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(logoScale, {
        toValue: 1, // settle
        stiffness: 120,
        damping: 14,
        mass: 1,
        useNativeDriver: true,
      }),
      // Step 3: Fade in tagline after logo settles
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      // Step 4: Hide native splash & finish
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      onFinish();
    });
  }, [logoOpacity, logoScale, taglineOpacity, bgOpacity, onFinish]);

  return (
    <Animated.View
      style={[styles.container, { backgroundColor, opacity: bgOpacity }]}
    >
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        {tagline}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  tagline: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AnimatedSplash;
