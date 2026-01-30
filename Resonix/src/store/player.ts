import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AudioData } from 'src/@types/audio';

interface Player {
  onGoingAudio: AudioData | null;
}

const initialState: Player = {
  onGoingAudio: null,
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
  },
});

export const getPlayerState = (state: { player: Player }) => state.player;

export const { updateOnGoingAudio } = slice.actions;

export default slice.reducer;
