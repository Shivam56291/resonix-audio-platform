import { useEffect, useRef } from 'react';
import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import { useSelector, useDispatch } from 'react-redux';

import { getPlayerState, updateOnGoingAudio } from 'src/store/player';
import { AudioData } from 'src/@types/audio';

export const useSetupTrackPlayer = () => {
  const isPlayerSetup = useRef(false);

  useEffect(() => {
    const initPlayer = async () => {
      if (!isPlayerSetup.current) {
        await TrackPlayer.setupPlayer();
        isPlayerSetup.current = true;
      }
    };

    initPlayer();
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
  const { onGoingAudio } = useSelector(getPlayerState);
  const dispatch = useDispatch();

  const isPlayerReady = playbackState !== State.None;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPlayerReady) {
      await updateQueue(data);
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }

    if (playbackState === State.Playing && onGoingAudio?.id === item.id) {
      await TrackPlayer.pause();
    }

    if (playbackState === State.Paused && onGoingAudio?.id === item.id) {
      await TrackPlayer.play();
    }
  };

  return {
    onAudioPress,
  };
};

export default useAudioController;
