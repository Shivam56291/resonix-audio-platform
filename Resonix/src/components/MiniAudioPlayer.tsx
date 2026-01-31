import { FC, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getPlayerState } from 'store/player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useProgress } from 'react-native-track-player';

import colors from '@utils/colors';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import useAudioController from 'src/hooks/useAudioController';
import { mapRange } from '@utils/math';
import Loader from '@ui/Loader';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudiPlayer: FC<Props> = () => {
  const { onGoingAudio } = useSelector(getPlayerState);
  const { isPlaying, togglePlayPause, isBusy } = useAudioController();
  const progress = useProgress();

  const rotation = useSharedValue(0);
  const posterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: isPlaying ? 1.05 : 1 },
    ],
  }));

  useEffect(() => {
    let animation: any;

    const startRotation = () => {
      // animate from current value + 360
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
      <View style={styles.progressContainer}>
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
      </View>

      <View style={styles.container}>
        <Animated.Image
          source={source}
          style={[
            styles.poster,
            posterAnimatedStyle,
            { borderRadius: MiniPlayerHeight / 2 },
          ]}
        />

        <View style={styles.contentContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {onGoingAudio?.title || 'Unknown Title'}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
            {onGoingAudio?.owner.name || 'Unknown Artist'}
          </Text>
        </View>

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
      </View>
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
