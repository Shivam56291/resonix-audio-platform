import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/store/index";


type notificationType = 'success' | 'error';

interface Notification {
  message: string,
  type: notificationType
    
}

const initialState: Notification = {
  message: '',
  type: 'error',
}

const slice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    updateNotification: (notificationState, action: PayloadAction<Notification>) => {
      notificationState.message = action.payload.message;
      notificationState.type = action.payload.type;
    },
    hideNotification: () => {
      return initialState;
    }, 
  }
})

export const getNotificationState = (state: RootState) => state.notification;

export const { updateNotification, hideNotification } = slice.actions;
export default slice.reducer;