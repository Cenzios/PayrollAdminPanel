import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import api from '../utils/axios';
import { toPlanView } from '../utils/planView';
import type { Plan, PlanUpdatePayload, SubscriptionPlanView } from '../types';
import type { ApiEnvelope } from '../auth/authTypes';

interface SubscriptionState {
  plans: SubscriptionPlanView[];
  isLoading: boolean;
  error: string | null;
  /** Decimal string (money). */
  additionalSlotPrice: string;
}

const initialState: SubscriptionState = {
  plans: [],
  isLoading: false,
  error: null,
  additionalSlotPrice: '150',
};

function extractErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error || fallback;
  }
  return fallback;
}

export const fetchPlans = createAsyncThunk<Plan[], void, { rejectValue: string }>(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiEnvelope<Plan[]>>('/admin/plans');
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch plans');
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to fetch plans'));
    }
  }
);

export const updatePlanData = createAsyncThunk<Plan, PlanUpdatePayload, { rejectValue: string }>(
  'subscription/updatePlan',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiEnvelope<Plan>>(`/admin/plans/${encodeURIComponent(id)}`, data);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to update plan');
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to update plan'));
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload.map(toPlanView);
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch plans';
      })
      .addCase(updatePlanData.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = toPlanView(action.payload);
        }
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
