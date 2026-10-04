// Mirrors prisma/schema.prisma enums in the B7A6 backend — keep in sync if the schema changes.

export const Role = { DONOR: "DONOR", HOSPITAL: "HOSPITAL", ADMIN: "ADMIN" } as const;
export type Role = (typeof Role)[keyof typeof Role];

export const BloodGroup = {
  A_POSITIVE: "A_POSITIVE",
  A_NEGATIVE: "A_NEGATIVE",
  B_POSITIVE: "B_POSITIVE",
  B_NEGATIVE: "B_NEGATIVE",
  AB_POSITIVE: "AB_POSITIVE",
  AB_NEGATIVE: "AB_NEGATIVE",
  O_POSITIVE: "O_POSITIVE",
  O_NEGATIVE: "O_NEGATIVE",
} as const;
export type BloodGroup = (typeof BloodGroup)[keyof typeof BloodGroup];

export const Gender = { MALE: "MALE", FEMALE: "FEMALE", OTHER: "OTHER" } as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const UrgencyLevel = { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", CRITICAL: "CRITICAL" } as const;
export type UrgencyLevel = (typeof UrgencyLevel)[keyof typeof UrgencyLevel];

export const RequestStatus = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  VERIFIED: "VERIFIED",
  MATCHING: "MATCHING",
  PARTIALLY_FULFILLED: "PARTIALLY_FULFILLED",
  FULFILLED: "FULFILLED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const MatchStatus = {
  NOTIFIED: "NOTIFIED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  EXPIRED: "EXPIRED",
  COMPLETED: "COMPLETED",
} as const;
export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];

export const DonationStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;
export type DonationStatus = (typeof DonationStatus)[keyof typeof DonationStatus];

export const PaymentProvider = { BKASH: "BKASH", STRIPE: "STRIPE", SSLCOMMERZ: "SSLCOMMERZ" } as const;
export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider];

export const PaymentPurpose = {
  PRIORITY_REQUEST_FEE: "PRIORITY_REQUEST_FEE",
  HOSPITAL_VERIFICATION_FEE: "HOSPITAL_VERIFICATION_FEE",
  PLATFORM_DONATION: "PLATFORM_DONATION",
} as const;
export type PaymentPurpose = (typeof PaymentPurpose)[keyof typeof PaymentPurpose];

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const NotificationType = {
  BLOOD_REQUEST_MATCH: "BLOOD_REQUEST_MATCH",
  REQUEST_VERIFIED: "REQUEST_VERIFIED",
  REQUEST_FULFILLED: "REQUEST_FULFILLED",
  DONATION_REMINDER: "DONATION_REMINDER",
  PAYMENT_STATUS: "PAYMENT_STATUS",
  GENERAL: "GENERAL",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

// ---------------------------------------------------------------------------
// API envelope — every backend response follows this shape
// ---------------------------------------------------------------------------
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors: Array<{ path?: string; message: string } | Record<string, unknown>>;
}

// ---------------------------------------------------------------------------
// Core DTOs
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  provider: "LOCAL" | "GOOGLE";
  avatar: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DonorProfile {
  id: string;
  userId?: string;
  bloodGroup: BloodGroup;
  dateOfBirth?: string;
  gender?: Gender;
  weightKg?: number;
  address?: string;
  city: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  medicalNotes?: string | null;
  createdAt: string;
  user?: { id: string; name: string; email?: string; phone?: string | null; avatar?: string | null };
}

export interface HospitalProfile {
  id: string;
  hospitalName: string;
  registrationNumber: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string; phone: string | null };
}

export interface BloodRequest {
  id: string;
  patientName: string;
  patientAge?: number | null;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsFulfilled: number;
  urgency: UrgencyLevel;
  status: RequestStatus;
  reason?: string | null;
  requiredBy: string;
  city: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  createdAt: string;
  hospital: { id: string; hospitalName: string; city: string };
  _count?: { matches: number; donations: number };
}

export interface RequestMatch {
  id: string;
  status: MatchStatus;
  notifiedAt: string;
  respondedAt: string | null;
  donor: { id: string; name: string; bloodGroup: BloodGroup; city: string };
}

// Returned by GET /blood-requests/matches/mine — a donor's own match rows,
// with the parent request embedded (as opposed to RequestMatch above, which is
// the hospital/admin view of one request's matched donors).
export interface MyMatch {
  id: string;
  status: MatchStatus;
  notifiedAt: string;
  respondedAt: string | null;
  bloodRequest: {
    id: string;
    patientName: string;
    bloodGroup: BloodGroup;
    urgency: UrgencyLevel;
    status: RequestStatus;
    city: string;
    requiredBy: string;
    hospital: { hospitalName: string };
  };
  donation: { id: string; status: DonationStatus } | null;
}

export interface Donation {
  id: string;
  unitsDonated: number;
  donationDate: string;
  status: DonationStatus;
  location: string | null;
  notes: string | null;
  createdAt: string;
  donorProfile: { id: string; bloodGroup: BloodGroup; user: { name: string } };
  bloodRequest: {
    id: string;
    patientName: string;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    unitsFulfilled: number;
    status: RequestStatus;
    hospital: { hospitalName: string };
  };
}

export interface Payment {
  id: string;
  purpose: PaymentPurpose;
  provider: PaymentProvider;
  amount: string | number;
  currency: string;
  transactionId: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  bloodRequest?: { id: string; patientName: string } | null;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  donors: { total: number; available: number };
  hospitals: { total: number; verified: number; pendingVerification: number };
  bloodRequests: { byStatus: Record<string, number>; createdThisMonth: number };
  donations: { byStatus: Record<string, number>; completedThisMonth: number };
  payments: { totalSuccessfulAmount: number; totalSuccessfulCount: number };
  topCitiesByRequests: Array<{ city: string; requestCount: number }>;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: unknown;
  newValue: unknown;
  createdAt: string;
  actor: { id: string; name: string; role: Role } | null;
}
