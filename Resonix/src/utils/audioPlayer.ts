import TrackPlayer, { State } from 'react-native-track-player';

let isInitialized = false;

export const setupTrackPlayer = async () => {
  if (isInitialized) return;

  try {
    const playbackState = await TrackPlayer.getPlaybackState();

    if (playbackState.state !== State.None) {
      isInitialized = true;
      return;
    }

    await TrackPlayer.setupPlayer();
    isInitialized = true;
  } catch {
    await TrackPlayer.setupPlayer();
    isInitialized = true;
  }
};
