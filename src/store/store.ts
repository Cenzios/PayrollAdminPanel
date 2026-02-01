import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
