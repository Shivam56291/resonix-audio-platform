import { getClient } from 'api/client';
import TrackPlayer, { Event } from 'react-native-track-player';
import { DeviceEventEmitter } from 'react-native';

import { queryClient } from 'queryClient';

DeviceEventEmitter.emit('HISTORY_UPDATED');

const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

interface StaleAudio {
  audio: string;
  progress: number;
  date: Date;
}

const sendHistory = async (staleAudio: StaleAudio) => {
  const client = await getClient();
  await client
    .post('/history', {
      ...staleAudio,
    })
    .catch(err => console.log(err));

  queryClient.invalidateQueries({ queryKey: ['histories'] });
};

const debouncedSendHistory = debounce(sendHistory, 1000);

const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, () => {
    TrackPlayer.seekTo(10);
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async event => {
    const lists = await TrackPlayer.getQueue();
    const audio = lists[event.track];

    const staleAudio: StaleAudio = {
      audio: audio.id,
      progress: event.position,
      date: new Date(Date.now()),
    };

    debouncedSendHistory(staleAudio);
  });
};

export default playbackService;
