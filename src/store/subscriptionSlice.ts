import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/axios';

interface SubscriptionFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  registrationFee: number;
  maxEmployees: number;
  features: SubscriptionFeature[];
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  additionalSlotPrice: number;
}

// Hardcoded features as requested
export const getHardcodedFeatures = (planName: string): SubscriptionFeature[] => {
  const commonFeatures = [
    { text: 'Automatic salary & deduction calculations', included: true },
    { text: 'Monthly payslip generation (PDF / CSV / Excel', included: true },
    { text: 'Employee profile management', included: true },
    { text: 'Manage multiple company', included: true },
    { text: 'Payroll report generations', included: true },
    { text: 'Secure dashboard for administrators', included: true },
  ];

  if (planName.toUpperCase().includes('BASIC')) {
    return [{ text: 'Payroll processing for 0 - 29 employees', included: true }, ...commonFeatures];
  } else if (planName.toUpperCase().includes('PROFESSIONAL')) {
    return [{ text: 'Payroll processing for 30 - 99 employees', included: true }, ...commonFeatures];
  } else {
    return [{ text: 'Payroll processing for 100 or more employees', included: true }, ...commonFeatures];
  }
};

const initialState: SubscriptionState = {
  plans: [],
  isLoading: false,
  error: null,
  additionalSlotPrice: 150,
};

export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/plans');
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch plans');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch plans');
    }
  }
);

export const updatePlanData = createAsyncThunk(
  'subscription/updatePlan',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/plans/${id}`, data);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to update plan');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update plan');
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
      .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.plans = action.payload.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: plan.employeePrice,
          priceLabel: 'Per employee',
          registrationFee: plan.registrationFee,
          maxEmployees: plan.maxEmployees,
          features: getHardcodedFeatures(plan.name),
        }));
      })
      .addCase(fetchPlans.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePlanData.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = {
            id: action.payload.id,
            name: action.payload.name,
            price: action.payload.employeePrice,
            priceLabel: 'Per employee',
            registrationFee: action.payload.registrationFee,
            maxEmployees: action.payload.maxEmployees,
            features: getHardcodedFeatures(action.payload.name),
          };
        }
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
