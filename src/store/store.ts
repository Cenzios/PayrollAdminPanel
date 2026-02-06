import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import subscriptionReducer from './subscriptionSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    subscription: subscriptionReducer,
    auth: authReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
