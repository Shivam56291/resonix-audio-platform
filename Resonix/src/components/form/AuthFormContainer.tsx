import { FC, ReactNode, useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import CircleUi from '@ui/CircleUi';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Image, Text, StyleSheet } from 'react-native';
import colors from '@utils/colors';

interface Props {
  heading?: string;
  subHeading?: string;
  children: ReactNode;
}

const getDynamicStyles = (width: number, height: number) => {
  const maxLogoWidth = width * 0.5;
  const maxLogoHeight = height * 0.15;

  return StyleSheet.create({
    logo: {
      width: maxLogoWidth,
      height: maxLogoHeight,
      resizeMode: 'contain',
      marginBottom: 12,
    },
  });
};

const AuthFormContainer: FC<Props> = ({ children, heading, subHeading }) => {
  const { width, height } = useWindowDimensions();
  const cricleSize = width * 0.5;
  const dynamicStyles = getDynamicStyles(width, height);

  const fadeOpacity = useSharedValue(0);
  const fadeInStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOpacity.value,
      transform: [
        {
          scale: 0.85 + fadeOpacity.value * 0.15,
        },
      ],
    };
  });

  useEffect(() => {
    fadeOpacity.value = withTiming(1, { duration: 800 });
  }, [fadeOpacity]);
  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, fadeInStyle]}>
        <CircleUi size={cricleSize} position="top-left" />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, fadeInStyle]}>
        <CircleUi size={cricleSize} position="top-right" />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, fadeInStyle]}>
        <CircleUi size={cricleSize} position="bottom-left" />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, fadeInStyle]}>
        <CircleUi size={cricleSize} position="bottom-right" />
      </Animated.View>

      <Animated.View style={[styles.headerContainer, fadeInStyle]}>
        <Image
          style={dynamicStyles.logo}
          source={require('@assets/light-logo.png')}
        />
        <Text style={styles.welcomeText}>{heading}</Text>
        <Text style={styles.subText}>{subHeading}</Text>
      </Animated.View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  headerContainer: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  welcomeText: {
    color: colors.SECONDARY,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  subText: {
    color: colors.CONTRAST,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AuthFormContainer;
