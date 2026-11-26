import type { Plan, PlanFeatureFlag, PlanFeatureView, SubscriptionPlanView } from '../types';

/** Included in every plan (not gated by a plan_feature flag). */
const CORE_FEATURES: readonly string[] = [
  'Automatic salary & deduction calculations',
  'Monthly payslip generation',
  'Employee profile management',
  'Secure dashboard for administrators',
];

/** Display text for known plan_feature flags; unknown flags are humanized from their name. */
const FEATURE_LABELS: Record<string, string> = {
  canViewReports: 'Payroll report generation',
  canExportData: 'Export payslips and reports (PDF / CSV / Excel)',
  prioritySupport: 'Priority support',
  customBranding: 'Custom branding',
};

function humanizeFeatureName(featureName: string): string {
  const words = featureName.replace(/^can/, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Card feature list derived from the plan's real limits and enabled feature flags. */
export function getPlanFeatures(plan: Pick<Plan, 'maxEmployees' | 'maxCompanies' | 'features'>): PlanFeatureView[] {
  const enabledFlags = (plan.features ?? []).filter((flag: PlanFeatureFlag): boolean => flag.isEnabled);
  return [
    { text: `Payroll processing for up to ${pluralize(plan.maxEmployees, 'employee', 'employees')}`, included: true },
    { text: `Manage up to ${pluralize(plan.maxCompanies, 'company', 'companies')}`, included: true },
    ...CORE_FEATURES.map((text): PlanFeatureView => ({ text, included: true })),
    ...enabledFlags.map((flag): PlanFeatureView => ({
      text: FEATURE_LABELS[flag.featureName] ?? humanizeFeatureName(flag.featureName),
      included: true,
    })),
  ];
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
    features: getPlanFeatures(plan),
  };
}
