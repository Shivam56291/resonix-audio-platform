import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/store/index';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  followers: number;
  followings: number;
}

interface AuthState {
  profile: UserProfile | null;
  loggedIn: boolean;
}

const initialState: AuthState = {
  profile: null,
  loggedIn: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateProfile: (
      authState,
      { payload }: PayloadAction<UserProfile | null>,
    ) => {
      authState.profile = payload;
    },
    updateLoggedInState: (authState, { payload }: PayloadAction<boolean>) => {
      authState.loggedIn = payload;
    },
  },
});

export const { updateProfile, updateLoggedInState } = slice.actions;

export const getAuthState = createSelector(
  (state: RootState) => state.auth,
  authState => authState,
);

export default slice.reducer;
