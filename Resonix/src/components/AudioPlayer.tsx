import { FC, ReactNode, useRef } from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import { useProgress } from 'react-native-track-player';
import formatDuration from 'format-duration';
import { useSelector } from 'react-redux';
import Slider, { SliderProps } from '@react-native-community/slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { getPlayerState } from 'store/player';
import AppModal from '@ui/AppModal';
import colors from 'utils/colors';
import AppLink from 'ui/AppLink';
import useAudioController from 'src/hooks/useAudioController';
import PlayPauseBtn from 'ui/PlayPauseBtn';
import type { AppModalRef } from '@ui/AppModal';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}

interface ExtendedSliderProps extends SliderProps {
  thumbTouchSize?: { width: number; height: number };
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, { leading: true });
};

const AudioPlayer: FC<Props> = ({ visible, onRequestClose, children }) => {
  const { duration, position } = useProgress();
  const { onGoingAudio } = useSelector(getPlayerState);
  const source = onGoingAudio?.poster
    ? { uri: onGoingAudio?.poster }
    : require('../../assets/music.png');

  const { seekTo } = useAudioController();
  const modalRef = useRef<AppModalRef>(null);

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  return (
    <AppModal ref={modalRef} visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        {children}
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

          <View style={styles.controls}>
            <Pressable
              style={{
                width: 45,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
              }}
            >
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </Pressable>

            <Pressable
              style={{
                width: 45,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
              }}
            >
              <FontAwesome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
            </Pressable>
            <PlayPauseBtn
              color={colors.CONTRAST}
              playing={true}
              onPress={() => {}}
            />
            <Pressable
              style={{
                width: 45,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
              }}
            >
              <FontAwesome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
            </Pressable>
            <Pressable
              style={{
                width: 45,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 25,
              }}
            >
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </Pressable>
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
    width: 200,
    height: 200,
    borderRadius: 10,
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
    paddingVertical: 10,
  },
  duration: {
    fontSize: 14,
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AudioPlayer;
