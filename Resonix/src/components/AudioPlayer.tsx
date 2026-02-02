import { FC, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useProgress } from 'react-native-track-player';
import formatDuration from 'format-duration';
import { useSelector } from 'react-redux';
import Slider, { SliderProps } from '@react-native-community/slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { getPlayerState } from 'store/player';
import AppModal from '@ui/AppModal';
import colors from 'utils/colors';
import AppLink from 'ui/AppLink';
import useAudioController from 'src/hooks/useAudioController';
import PlayPauseBtn from 'ui/PlayPauseBtn';
import type { AppModalRef } from '@ui/AppModal';
import PlayerController from 'ui/PlayerController';
import Loader from 'ui/Loader';

interface Props {
  visible: boolean;
  onCloseComplete: () => void;
}

interface ExtendedSliderProps extends SliderProps {
  thumbTouchSize?: { width: number; height: number };
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, { leading: true });
};

const AudioPlayer: FC<Props> = ({ visible, onCloseComplete }) => {
  const { duration, position } = useProgress();
  const { onGoingAudio } = useSelector(getPlayerState);
  const source = onGoingAudio?.poster
    ? { uri: onGoingAudio?.poster }
    : require('../../assets/music.png');

  const imageScale = useSharedValue(0.95);
  const controlsTranslate = useSharedValue(20);

  const { isPlaying, isBusy, seekTo, skipTo, togglePlayPause } =
    useAudioController();
  const modalRef = useRef<AppModalRef>(null);

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    await skipTo(skipType === 'forward' ? 10 : -10);
  };

  if (isPlaying) {
    imageScale.value = withSpring(1);
  } else {
    imageScale.value = withSpring(0.95);
  }
  if (visible) {
    controlsTranslate.value = withSpring(0);
  } else {
    controlsTranslate.value = withSpring(20);
  }

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));
  const controlsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: controlsTranslate.value }],
    opacity: controlsTranslate.value === 0 ? 1 : 0.8,
  }));

  return (
    <AppModal
      ref={modalRef}
      visible={visible}
      onCloseComplete={onCloseComplete}
    >
      <View style={styles.container}>
        <Animated.Image source={source} style={[styles.poster, imageStyle]} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <AppLink
            title={onGoingAudio?.owner.name || 'Unknown Artist'}
            onPress={() => {}}
          />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {formattedDuration(duration * 1000)}
            </Text>
          </View>
          <Slider
            {...({
              style: { width: '100%', height: 40 },
              minimumValue: 0,
              maximumValue: duration,
              value: position,
              minimumTrackTintColor: colors.CONTRAST,
              maximumTrackTintColor: colors.INACTIVE_CONTRAST,
              thumbTintColor: colors.CONTRAST,
              thumbTouchSize: { width: 45, height: 45 },
              onSlidingStart: () => modalRef.current?.setPanEnabled(false),
              onSlidingComplete: value => {
                modalRef.current?.setPanEnabled(true);
                updateSeek(value);
              },
            } as ExtendedSliderProps)}
          />
          <Animated.View style={[styles.controls, controlsStyle]}>
            <PlayerController onPress={() => {}} ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerController>

            <PlayerController
              onPress={() => handleSkipTo('reverse')}
              ignoreContainer
            >
              <FontAwesome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerController>
            {isBusy ? (
              <Loader
                size={50}
                color={colors.PRIMARY}
                bgColor={colors.CONTRAST}
              />
            ) : (
              <PlayPauseBtn
                color={colors.PRIMARY}
                playing={isPlaying}
                onPress={() => togglePlayPause()}
                size={50}
              />
            )}

            <PlayerController
              onPress={() => handleSkipTo('forward')}
              ignoreContainer
            >
              <FontAwesome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>+10s</Text>
            </PlayerController>
            <PlayerController onPress={() => {}} ignoreContainer>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerController>
          </Animated.View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    marginTop: 20,
    width: 220,
    height: 220,
    borderRadius: 10,
  },
  skipText: {
    fontSize: 12,
    color: colors.CONTRAST,
    marginTop: 2,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  duration: {
    fontSize: 14,
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
});

export default AudioPlayer;
