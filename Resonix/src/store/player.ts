import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AudioData } from 'src/@types/audio';

interface Player {
  onGoingAudio: AudioData | null;
  onGoingList: AudioData[];
}

const initialState: Player = {
  onGoingAudio: null,
  onGoingList: [],
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
  },
});

export const getPlayerState = (state: { player: Player }) => state.player;

export const { updateOnGoingAudio, updateOnGoingList } = slice.actions;

export default slice.reducer;
