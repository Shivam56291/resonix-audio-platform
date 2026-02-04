import { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useProgress } from 'react-native-track-player';
import formatDuration from 'format-duration';
import { useDispatch, useSelector } from 'react-redux';
import Slider, { SliderProps } from '@react-native-community/slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getPlayerState, updatePlaybackRate } from 'store/player';
import AppModal from '@ui/AppModal';
import colors from 'utils/colors';
import AppLink from 'ui/AppLink';
import useAudioController from 'src/hooks/useAudioController';
import PlayPauseBtn from 'ui/PlayPauseBtn';
import type { AppModalRef } from '@ui/AppModal';
import PlayerController from 'ui/PlayerController';
import Loader from 'ui/Loader';
import { hapticLight, hapticMedium } from '@utils/haptics';
import PlaybackRateSelector from 'ui/PlaybackRateSelector';
import AudioInfoContainer from './AudioInfoContainer';

interface Props {
  visible: boolean;
  onCloseComplete: () => void;
  onListOptionPress?: () => void;
}

interface ExtendedSliderProps extends SliderProps {
  thumbTouchSize?: { width: number; height: number };
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, { leading: true });
};

const AudioPlayer: FC<Props> = ({
  visible,
  onCloseComplete,
  onListOptionPress,
}) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const { duration, position } = useProgress();
  const { onGoingAudio, playbackRate } = useSelector(getPlayerState);
  const source = onGoingAudio?.poster
    ? { uri: onGoingAudio?.poster }
    : require('../../assets/music.png');
  const dispatch = useDispatch();

  const imageScale = useSharedValue(0.95);
  const controlsTranslate = useSharedValue(20);

  const {
    isPlaying,
    isBusy,
    seekTo,
    skipTo,
    togglePlayPause,
    onNextPress,
    onPreviousPress,
    setPlaybackRate,
  } = useAudioController();
  const modalRef = useRef<AppModalRef>(null);

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    await skipTo(skipType === 'forward' ? 10 : -10);
  };

  useEffect(() => {
    imageScale.value = withSpring(isPlaying ? 1 : 0.95, {
      damping: 14,
      stiffness: 180,
      mass: 0.7,
    });
  }, [isPlaying, imageScale]);

  useEffect(() => {
    controlsTranslate.value = withSpring(visible ? 0 : 20, {
      damping: 18,
      stiffness: 160,
    });
  }, [visible, controlsTranslate]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const controlsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: controlsTranslate.value }],
    opacity: 1 - controlsTranslate.value / 20,
  }));

  const onPlaybackRatePress = async (rate: number) => {
    await setPlaybackRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  return (
    <AppModal
      ref={modalRef}
      visible={visible}
      onCloseComplete={onCloseComplete}
    >
      <View style={styles.container}>
        <AudioInfoContainer
          visible={showAudioInfo}
          closeHandler={setShowAudioInfo}
        />
        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={({ pressed }) => {
            return [styles.infoBtn, pressed && styles.pressed];
          }}
        >
          <MaterialCommunityIcon
            name="information-outline"
            size={24}
            color={colors.CONTRAST}
          />
        </Pressable>

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
            <PlayerController
              onPress={() => onPreviousPress()}
              ignoreContainer
              onHaptic={hapticMedium}
            >
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerController>

            <PlayerController
              onPress={() => handleSkipTo('reverse')}
              ignoreContainer
              onHaptic={hapticLight}
            >
              <FontAwesome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerController>
            {isBusy ? (
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: colors.CONTRAST,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Loader size={36} color={colors.PRIMARY} />
              </View>
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
              onHaptic={hapticLight}
            >
              <FontAwesome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>+10s</Text>
            </PlayerController>
            <PlayerController
              onPress={() => onNextPress()}
              ignoreContainer
              onHaptic={hapticMedium}
            >
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerController>
          </Animated.View>

          <View style={{ alignItems: 'center', marginTop: 25 }}>
            <PlaybackRateSelector
              onPress={onPlaybackRatePress}
              activeRate={playbackRate.toString()}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.INACTIVE_CONTRAST,
                marginTop: 6,
              }}
            >
              Playback speed
            </Text>
          </View>
          <View style={styles.listOptionBtnContainer}>
            <PlayerController ignoreContainer onPress={onListOptionPress}>
              <MaterialCommunityIcon
                name="playlist-music"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerController>
          </View>
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
    marginTop: 15,
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
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
  infoBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  listOptionBtnContainer: {
    alignItems: 'flex-end',
  },
});

export default AudioPlayer;
