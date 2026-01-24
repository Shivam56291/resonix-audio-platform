import { configureStore } from '@reduxjs/toolkit';

import authReducer from 'src/store/auth';
import notificationReducer from 'src/store/notification';

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
