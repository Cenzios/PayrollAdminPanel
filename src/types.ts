export type Role = 'ADMIN' | 'SUPER_ADMIN';

export type SubscriptionStatus = 'DRAFT' | 'PENDING_ACTIVATION' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'FAILED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: string;
  companyCount?: number;
  employeeCount?: number;
  currentPlan?: string;
  subscriptionStatus?: SubscriptionStatus;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  createdAt: string;
  ownerName: string;
  employeeCount: number;
  subscriptionPlan: string;
  departments?: string[];
  ownerId?: string;
}

/** Plan as returned by GET /api/admin/plans. Money fields are decimal strings. */
export interface Plan {
  id: string;
  name: string;
  price: string;
  employeePrice: string;
  registrationFee: string;
  maxEmployees: number;
  maxCompanies: number;
  description: string;
}

export interface PlanFeatureView {
  text: string;
  included: boolean;
}

/** Plan as shown on the Subscriptions page / edit modal. */
export interface SubscriptionPlanView {
  id: string;
  name: string;
  /** Per-employee price (decimal string). */
  price: string;
  priceLabel: string;
  registrationFee: string;
  maxEmployees: number;
  features: PlanFeatureView[];
}

/** PUT /api/admin/plans/:id body. Money is sent as decimal strings. */
export interface PlanUpdatePayload {
  id: string;
  data: {
    name: string;
    employeePrice: string;
    registrationFee: string;
    maxEmployees: number;
  };
}

/** GET /admin/revenue/summary. Money fields are decimal strings. */
export interface RevenueSummary {
  totalRevenue: string;
  onlineRevenue: string;
  manualRevenue: string;
  monthlyRevenue: string;
  overdueCount: number;
}

/** Invoice row from GET /admin/revenue/invoices (fields used here). */
export interface InvoiceRow {
  id: string;
  billingMonth: string;
  billingType: string;
  status: string;
  /** Decimal string (money). */
  totalAmount: string;
  createdAt: string;
  user: { fullName: string; email: string };
}

/** GET /admin/users/:userId (fields used by the user-details modal). Money fields are decimal strings. */
export interface UserDetails {
  user: {
    id: string;
    fullName: string;
    email: string;
    /** ACTIVE | SUSPENDED | LOCKED */
    accountStatus: string;
  };
  currentSubscription: {
    planName: string;
    status: string;
    startDate: string;
    endDate: string;
    employeePrice: string;
    extraSlots: number;
  } | null;
  companies: { id: string; name: string; employeeCount: number }[];
  stats: {
    totalEmployees: number;
    /** Plan employeePrice x active employees (decimal string). */
    monthlyBill: string;
    nextPaymentDate: string | null;
  };
  invoiceHistory: {
    id: string;
    /** Decimal string (money). */
    amount: string;
    status: string;
    month: string;
    type: string;
    createdAt: string;
  }[];
}
