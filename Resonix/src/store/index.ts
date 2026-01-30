import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'src/store/auth';
import notificationReducer from 'src/store/notification';
import playerReducer from 'src/store/player';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
