import { useEffect } from 'react';
import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import { useSelector, useDispatch } from 'react-redux';

import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
} from 'src/store/player';
import { AudioData } from 'src/@types/audio';
import deepEqual from 'deep-equal';

import { setupTrackPlayer } from '@utils/audioPlayer';

export const useSetupTrackPlayer = () => {
  useEffect(() => {
    setupTrackPlayer();
  }, []);
};

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map(audio => ({
    id: audio.id,
    url: audio.file,
    title: audio.title,
    artwork: audio.poster || require('../../assets/music.png'),
    artist: audio.owner.name,
    genre: audio.category,
    isLiveStream: true,
  }));
  await TrackPlayer.add([...lists]);
};

const useAudioController = () => {
  const { state: playbackState } = usePlaybackState() as { state?: State };
  const { onGoingAudio, onGoingList } = useSelector(getPlayerState);
  const dispatch = useDispatch();

  const isPlayerReady = playbackState && playbackState !== State.None;
  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Loading;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPlayerReady) {
      await updateQueue(data);
      dispatch(updateOnGoingAudio(item));
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      return dispatch(updateOnGoingList(data));
    }

    if (playbackState === State.Playing && onGoingAudio?.id === item.id) {
      return await TrackPlayer.pause();
    }

    if (playbackState === State.Paused && onGoingAudio?.id === item.id) {
      return await TrackPlayer.play();
    }

    if (onGoingAudio?.id !== item.id) {
      const fromSameList = deepEqual(onGoingList, data);

      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);

      if (!fromSameList) {
        await TrackPlayer.reset();
        await updateQueue(data);
        dispatch(updateOnGoingList(data));
      }
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    }
    if (isPaused) {
      await TrackPlayer.play();
    }
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (seconds: number) => {
    const { position, duration } = await TrackPlayer.getProgress();
    const newPosition = Math.min(Math.max(position + seconds, 0), duration);

    await TrackPlayer.seekTo(newPosition);

    const playback = await TrackPlayer.getPlaybackState();

    if (playback.state !== State.Playing) {
      setTimeout(() => {
        TrackPlayer.play();
      }, 150);
    }
  };

  const skipBack = async (seconds: number) => {
    const { position } = await TrackPlayer.getProgress();
    const newPosition = Math.max(position - seconds, 0);

    await TrackPlayer.seekTo(newPosition);

    const playback = await TrackPlayer.getPlaybackState();

    if (playback.state !== State.Playing) {
      setTimeout(() => {
        TrackPlayer.play();
      }, 150);
    }
  };

  const onNextPress = async () => {
    try {
      await TrackPlayer.skipToNext();

      await TrackPlayer.play();

      setTimeout(async () => {
        const activeTrack = await TrackPlayer.getActiveTrack();
        if (!activeTrack) return;

        const nextIndex = onGoingList.findIndex(
          item => item.id === activeTrack.id,
        );

        if (nextIndex !== -1) {
          dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
        }
      }, 50);
    } catch {
      // No next track → do nothing
    }
  };

  const onPreviousPress = async () => {
    try {
      await TrackPlayer.skipToPrevious();

      await TrackPlayer.play();

      setTimeout(async () => {
        const activeTrack = await TrackPlayer.getActiveTrack();
        if (!activeTrack) return;

        const nextIndex = onGoingList.findIndex(
          item => item.id === activeTrack.id,
        );

        if (nextIndex !== -1) {
          dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
        }
      }, 50);
    } catch {
      // No previous track → do nothing
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
  };

  return {
    onAudioPress,
    isPlayerReady,
    isPlaying,
    togglePlayPause,
    isBusy,
    seekTo,
    skipTo,
    skipBack,
    onNextPress,
    onPreviousPress,
    setPlaybackRate,
  };
};

export default useAudioController;
