import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
