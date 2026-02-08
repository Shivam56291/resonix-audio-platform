import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';

let isInitialized = false;

export const setupTrackPlayer = async () => {
  if (isInitialized) return;

  await TrackPlayer.setupPlayer();

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    progressUpdateEventInterval: 2,
  });

  isInitialized = true;
};
