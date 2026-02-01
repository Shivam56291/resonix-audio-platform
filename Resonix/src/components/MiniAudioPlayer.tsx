import { FC, useCallback, useEffect, useRef, useState } from 'react';
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

const MINI_SPRING = {
  damping: 22,
  stiffness: 260,
  mass: 0.55,
};

export const MiniPlayerHeight = 60;

const MiniAudiPlayer: FC<Props> = () => {
  const { onGoingAudio } = useSelector(getPlayerState);
  const { isPlaying, togglePlayPause, isBusy } = useAudioController();
  const progress = useProgress();
  const [playerVisibility, setPlayerVisibility] = useState(false);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const progressOpacity = useSharedValue(1);

  const miniPlayerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const rotation = useSharedValue(0);
  const posterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: rotation.value + 'deg' },
      { scale: isPlaying ? 1.05 : 1 },
    ],
    opacity: fadeAnim.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const closePlayerModal = useCallback(() => {
    // hide modal
    setPlayerVisibility(false);

    // animate mini player back
    scale.value = withSpring(1, { damping: 26 });
    opacity.value = withSpring(1, { damping: 26 });
    translateY.value = withSpring(0, MINI_SPRING);
    progressOpacity.value = withSpring(1, { damping: 30 });
  }, [opacity, progressOpacity, scale, translateY]);

  const showPlayerModal = () => {
    progressOpacity.value = withTiming(0, { duration: 200 });
    scale.value = withSpring(0.97, { damping: 26 });
    translateY.value = withSpring(MiniPlayerHeight + 20, MINI_SPRING);
    opacity.value = withSpring(0.95);
    setPlayerVisibility(true);
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  useEffect(() => {
    let animation: any;

    const startRotation = () => {
      animation = withRepeat(
        withTiming(rotation.value + 360, { duration: 8300 }),
        -1,
        false,
      );
      rotation.value = animation;
    };

    if (isPlaying) {
      startRotation();
    } else {
      rotation.value = rotation.value;
    }
  }, [isPlaying, onGoingAudio?.id, rotation]);

  const previousAudioId = useRef<string | undefined>(onGoingAudio?.id);
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    if (onGoingAudio?.id !== previousAudioId.current) {
      // fade out
      fadeAnim.value = withTiming(0, { duration: 200 }, () => {
        previousAudioId.current = onGoingAudio?.id;
        fadeAnim.value = withTiming(1, { duration: 200 });
      });
    }
  }, [onGoingAudio?.id, fadeAnim]);

  const source = onGoingAudio?.poster
    ? { uri: onGoingAudio?.poster }
    : require('../../assets/music.png');

  const progressWidth = mapRange({
    inputMin: 0,
    inputMax: progress.duration,
    inputValue: progress.position,
    outputMin: 0,
    outputMax: 100,
  });

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
          onPressIn={() => {
            scale.value = withSpring(0.97, { damping: 30 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 30 });
          }}
          onPress={showPlayerModal}
        >
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {onGoingAudio?.title || 'Unknown Title'}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
            {onGoingAudio?.owner.name || 'Unknown Artist'}
          </Text>
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
          <PlayPauseBtn playing={isPlaying} onPress={togglePlayPause} />
        )}
      </Animated.View>

      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
      />
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
