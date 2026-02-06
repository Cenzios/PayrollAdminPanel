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
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  employeePrice: number;
  registrationFee: number;
  maxEmployees: number;
  maxCompanies: number;
  description: string;
  features: string[];
}
