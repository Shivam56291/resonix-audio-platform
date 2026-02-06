import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSelector } from 'react-redux';
import { FC, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from 'utils/colors';
import AppLink from 'ui/AppLink';
import { getPlayerState } from 'store/player';

interface Props {
  visible: boolean;
  closeHandler: (state: boolean) => void;
}

const AudioInfoContainer: FC<Props> = ({ visible, closeHandler }) => {
  const { onGoingAudio } = useSelector(getPlayerState);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: visible ? 180 : 150,
    });

    translateY.value = withTiming(visible ? 0 : 20, {
      duration: visible ? 180 : 150,
    });
  }, [visible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.container, animatedStyle]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0,0,0,0.15)' },
        ]}
      />

      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="xlight"
        blurAmount={16}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.1)"
      />
      <Pressable
        onPress={() => closeHandler(false)}
        style={({ pressed }) => [pressed && styles.pressed, styles.closeBtn]}
      >
        <MaterialCommunityIcon
          name="close-circle-outline"
          size={24}
          color={colors.CONTRAST}
        />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>

          <View style={styles.ownerInfo}>
            <Text style={styles.creator}>Creator: </Text>
            <AppLink title={onGoingAudio?.owner.name || 'Unknown Artist'} />
          </View>

          <Text style={styles.description}>{onGoingAudio?.about}</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    inset: 0,
    padding: 20,
    zIndex: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.CONTRAST,
    marginBottom: 6,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  creator: {
    fontSize: 16,
    color: colors.SECONDARY,
  },
  description: {
    fontSize: 16,
    color: colors.CONTRAST,
    lineHeight: 24,
    marginTop: 14,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.92 }],
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
});

export default AudioInfoContainer;
