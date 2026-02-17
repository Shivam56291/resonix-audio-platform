import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlaylistModal {
  visible: boolean;
  selectedListId?: string;
}

const initialState: PlaylistModal = {
  visible: false,
};

const slice = createSlice({
  name: 'playlistModal',
  initialState,
  reducers: {
    updatePlaylistVisibility: (playerState, action: PayloadAction<boolean>) => {
      playerState.visible = action.payload;
    },
    updateSelectedList: (playerState, action: PayloadAction<string>) => {
      playerState.selectedListId = action.payload;
    },
  },
});

export const getPlaylistModalState = (state: {
  playlistModal: PlaylistModal;
}) => state.playlistModal;

export const { updatePlaylistVisibility, updateSelectedList } = slice.actions;

export default slice.reducer;
