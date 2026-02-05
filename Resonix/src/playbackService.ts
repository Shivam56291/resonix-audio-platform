import { getClient } from 'api/client';
import TrackPlayer, { Event } from 'react-native-track-player';

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

    const client = await getClient();
    await client.post('/history', {
      audio: audio.id,
      progress: event.position,
      date: new Date(Date.now()),
    }).catch(err => console.log(err));
  });
};

export default playbackService;
