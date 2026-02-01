import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  features: SubscriptionFeature[];
}

interface SubscriptionState {
  plans: SubscriptionPlan[];
  additionalSlotPrice: number;
}

const initialState: SubscriptionState = {
  plans: [
    {
      id: 'basic',
      name: 'BASIC PLAN',
      price: 100,
      priceLabel: 'Per employee',
      registrationFee: 2500,
      features: [
        { text: 'Payroll processing for 0 - 29 employees', included: true },
        { text: 'Automatic salary & deduction calculations', included: true },
        { text: 'Monthly payslip generation (PDF / CSV / Excel', included: true },
        { text: 'Employee profile management', included: true },
        { text: 'Manage multiple company', included: true },
        { text: 'Payroll report generations', included: true },
        { text: 'Secure dashboard for administrators', included: true },
      ],
    },
    {
      id: 'professional',
      name: 'PROFRSSIONAL PLAN',
      price: 75,
      priceLabel: 'Per employee',
      registrationFee: 5000,
      features: [
        { text: 'Payroll processing for 30 - 99 employees', included: true },
        { text: 'Automatic salary & deduction calculations', included: true },
        { text: 'Monthly payslip generation (PDF / CSV / Excel', included: true },
        { text: 'Employee profile management', included: true },
        { text: 'Manage multiple company', included: true },
        { text: 'Payroll report generations', included: true },
        { text: 'Secure dashboard for administrators', included: true },
      ],
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE PLAN',
      price: 50,
      priceLabel: 'Per employee',
      registrationFee: 7500,
      features: [
        { text: 'Payroll processing for 100 or more employees', included: true },
        { text: 'Automatic salary & deduction calculations', included: true },
        { text: 'Monthly payslip generation (PDF / CSV / Excel', included: true },
        { text: 'Employee profile management', included: true },
        { text: 'Manage multiple company', included: true },
        { text: 'Payroll report generations', included: true },
        { text: 'Secure dashboard for administrators', included: true },
      ],
    },
  ],
  additionalSlotPrice: 150,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    updatePlan: (state, action: PayloadAction<SubscriptionPlan>) => {
      const index = state.plans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },
    updateAdditionalSlotPrice: (state, action: PayloadAction<number>) => {
      state.additionalSlotPrice = action.payload;
    },
  },
});

export const { updatePlan, updateAdditionalSlotPrice } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
