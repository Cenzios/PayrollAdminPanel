import type { Plan, PlanFeatureView, SubscriptionPlanView } from '../types';

const COMMON_FEATURES: readonly PlanFeatureView[] = [
  { text: 'Automatic salary & deduction calculations', included: true },
  { text: 'Monthly payslip generation (PDF / CSV / Excel', included: true },
  { text: 'Employee profile management', included: true },
  { text: 'Manage multiple company', included: true },
  { text: 'Payroll report generations', included: true },
  { text: 'Secure dashboard for administrators', included: true },
];

// Hardcoded features as requested
export function getHardcodedFeatures(planName: string): PlanFeatureView[] {
  const upperName = planName.toUpperCase();
  if (upperName.includes('BASIC')) {
    return [{ text: 'Payroll processing for unlimited employees', included: true }, ...COMMON_FEATURES];
  }
  if (upperName.includes('PROFESSIONAL')) {
    return [{ text: 'Payroll processing for 30 - 99 employees', included: true }, ...COMMON_FEATURES];
  }
  return [{ text: 'Payroll processing for 100 or more employees', included: true }, ...COMMON_FEATURES];
}

/** Maps an API plan to the card/edit-modal view. Money stays a decimal string. */
export function toPlanView(plan: Plan): SubscriptionPlanView {
  return {
    id: plan.id,
    name: plan.name,
    price: plan.employeePrice,
    priceLabel: 'Per employee',
    registrationFee: plan.registrationFee,
    maxEmployees: plan.maxEmployees,
    features: getHardcodedFeatures(plan.name),
  };
}
