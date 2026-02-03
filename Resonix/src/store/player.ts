import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AudioData } from 'src/@types/audio';

interface Player {
  onGoingAudio: AudioData | null;
  onGoingList: AudioData[];
  playbackRate: number;
}

const initialState: Player = {
  onGoingAudio: null,
  onGoingList: [],
  playbackRate: 1,
};

const slice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updateOnGoingAudio: (
      playerState,
      action: PayloadAction<AudioData | null>,
    ) => {
      playerState.onGoingAudio = action.payload;
    },
    updateOnGoingList: (
      playerState,
      action: PayloadAction<AudioData[]>,
    ) => {
      playerState.onGoingList = action.payload;
    },
    updatePlaybackRate: (
      playerState,
      action: PayloadAction<number>
    ) => {
      playerState.playbackRate = action.payload
    }
  },
});

export const getPlayerState = (state: { player: Player }) => state.player;

export const { updateOnGoingAudio, updateOnGoingList, updatePlaybackRate } = slice.actions;

export default slice.reducer;
