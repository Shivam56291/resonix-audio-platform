import { FC, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getPlayerState } from 'store/player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useProgress } from 'react-native-track-player';

import colors from '@utils/colors';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import useAudioController from 'src/hooks/useAudioController';
import { mapRange } from '@utils/math';
import Loader from '@ui/Loader';
import AudioPlayer from './AudioPlayer';

interface Props {}

export const MiniPlayerHeight = 60;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MiniAudiPlayer: FC<Props> = () => {
  const { onGoingAudio } = useSelector(getPlayerState);
  const { isPlaying, togglePlayPause, isBusy } = useAudioController();
  const progress = useProgress();
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [displayedAudio, setDisplayedAudio] = useState(onGoingAudio);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const progressOpacity = useSharedValue(1);
  const posterScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const textTranslateY = useSharedValue(0);

  const miniPlayerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const fadeAnim = useSharedValue(1);
  const isPlayingSV = useSharedValue(isPlaying);

  useEffect(() => {
    isPlayingSV.value = isPlaying;
  }, [isPlaying, isPlayingSV]);

  const rotation = useSharedValue(0);

  const posterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: posterScale.value },
    ],
    opacity: fadeAnim.value,
  }));
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const closePlayerModal = useCallback(() => {
    // hide modal
    setPlayerVisibility(false);

    // animate mini player back
    opacity.value = withTiming(1, { duration: 220 });

    // ⬇️ tiny delay ONLY on scale
    scale.value = withDelay(40, withTiming(1, { duration: 260 }));

    translateY.value = withTiming(0, { duration: 280 });
    progressOpacity.value = withTiming(1, { duration: 220 });
  }, [opacity, progressOpacity, scale, translateY]);

  const showPlayerModal = () => {
    progressOpacity.value = withTiming(0, { duration: 180 });

    scale.value = withTiming(0.92, { duration: 180 });
    opacity.value = withTiming(0, { duration: 160 });
    translateY.value = withTiming(MiniPlayerHeight + 24, { duration: 220 });

    setPlayerVisibility(true);
  };

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 8300 }),
        -1,
        false,
      );
    } else {
      rotation.value = withTiming(rotation.value % 360, { duration: 300 });
    }
  }, [isPlaying, onGoingAudio?.id, rotation]);

  const onModalClosed = useCallback(() => {
    closePlayerModal(); // animate mini player back AFTER modal closes
  }, [closePlayerModal]);

  useEffect(() => {
    if (!onGoingAudio) return;
    if (onGoingAudio.id === displayedAudio?.id) return;

    // 1️⃣ Animate OUT old content
    fadeAnim.value = withTiming(0, { duration: 140 });
    posterScale.value = withTiming(0.96, { duration: 140 });

    textOpacity.value = withTiming(0, { duration: 120 });
    textTranslateY.value = withTiming(6, { duration: 120 });

    // 2️⃣ AFTER fade-out, swap content
    const timeout = setTimeout(() => {
      setDisplayedAudio(onGoingAudio);

      // 3️⃣ Animate IN new content
      fadeAnim.value = withTiming(1, { duration: 220 });
      posterScale.value = withSpring(1, { damping: 26 });

      textTranslateY.value = -6;
      textOpacity.value = 0;

      textOpacity.value = withTiming(1, { duration: 180 });
      textTranslateY.value = withTiming(0, { duration: 180 });

      // 4️⃣ Micro pulse
      scale.value = withSequence(
        withTiming(0.98, { duration: 90 }),
        withSpring(1, { damping: 24 }),
      );
    }, 140);

    return () => clearTimeout(timeout);
  }, [
    onGoingAudio,
    displayedAudio?.id,
    fadeAnim,
    posterScale,
    scale,
    textOpacity,
    textTranslateY,
  ]);

  const source = displayedAudio?.poster
    ? { uri: displayedAudio.poster }
    : require('../../assets/music.png');

  const progressWidth =
    progress.duration > 0
      ? mapRange({
          inputMin: 0,
          inputMax: progress.duration,
          inputValue: progress.position,
          outputMin: 0,
          outputMax: 100,
        })
      : 0;

  useEffect(() => {
    rotation.value = 0;
  }, [onGoingAudio?.id, rotation]);

  return (
    <>
      <Animated.View style={[styles.progressContainer, progressStyle]}>
        <LinearGradient
          colors={[colors.GRADIENT_START, colors.GRADIENT_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${progressWidth}%`,
            height: 2,
            borderRadius: 2,
            shadowColor: colors.GRADIENT_END,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}
        />
      </Animated.View>

      <Animated.View style={[styles.container, miniPlayerStyle]}>
        <Animated.Image
          source={source}
          style={[
            styles.poster,
            posterAnimatedStyle,
            { borderRadius: MiniPlayerHeight / 2 },
          ]}
        />

        <AnimatedPressable
          style={styles.contentContainer}
          onPress={showPlayerModal}
          onPressIn={() => {
            if (!playerVisibility) {
              scale.value = withSpring(0.97, { damping: 30 });
            }
          }}
          onPressOut={() => {
            if (!playerVisibility) {
              scale.value = withSpring(1, { damping: 30 });
            }
          }}
        >
          <Animated.View style={textAnimatedStyle}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
              {displayedAudio?.title || 'Unknown Title'}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
              {displayedAudio?.owner.name || 'Unknown Artist'}
            </Text>
          </Animated.View>
        </AnimatedPressable>

        <Pressable style={styles.iconButton}>
          <MaterialIcons
            name="favorite-outline"
            size={24}
            color={colors.CONTRAST}
          />
        </Pressable>

        {isBusy ? (
          <View style={styles.iconButton}>
            <Loader size={24} color={colors.CONTRAST} />
          </View>
        ) : (
          <PlayPauseBtn playing={isPlaying} onPress={togglePlayPause} color={colors.CONTRAST} bgColor={colors.PRIMARY} />
        )}
      </Animated.View>

      <AudioPlayer visible={playerVisibility} onCloseComplete={onModalClosed} />
    </>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    height: 2,
    width: '100%',
    backgroundColor: colors.TERTIARY_CONTRAST,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    height: MiniPlayerHeight - 10,
    aspectRatio: 1,
    borderRadius: 5,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
    paddingHorizontal: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    fontSize: 16,
  },
  name: {
    color: colors.SECONDARY,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  iconButton: {
    paddingHorizontal: 10,
  },
});

export default MiniAudiPlayer;
