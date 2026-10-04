import { BloodGroup, Gender, UrgencyLevel } from "@/types";

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−",
};

export const BLOOD_GROUP_OPTIONS = Object.entries(BLOOD_GROUP_LABELS).map(([value, label]) => ({
  value: value as BloodGroup,
  label,
}));

export const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const URGENCY_OPTIONS: Array<{ value: UrgencyLevel; label: string }> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export const URGENCY_BADGE_VARIANT: Record<UrgencyLevel, "default" | "pending" | "primary"> = {
  LOW: "default",
  MEDIUM: "default",
  HIGH: "pending",
  CRITICAL: "primary",
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING_VERIFICATION: "Pending verification",
  VERIFIED: "Verified",
  MATCHING: "Matching donors",
  PARTIALLY_FULFILLED: "Partially fulfilled",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

// Only providers actually wired up end-to-end in the backend (bKash is a documented
// extension point there, not implemented) — so it's left out of the UI entirely rather
// than offering a flow that would dead-end.
export const PAYMENT_PROVIDER_OPTIONS = [
  { value: "STRIPE", label: "Card (Stripe)" },
  { value: "SSLCOMMERZ", label: "SSLCommerz (bKash/Nagad/Cards)" },
] as const;

export const PAYMENT_STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "outline"> = {
  PENDING: "outline",
  SUCCESS: "success",
  FAILED: "destructive",
  CANCELLED: "destructive",
  REFUNDED: "default",
};

export const PAYMENT_PURPOSE_LABELS: Record<string, string> = {
  PRIORITY_REQUEST_FEE: "Priority request fee",
  HOSPITAL_VERIFICATION_FEE: "Hospital verification fee",
  PLATFORM_DONATION: "Platform donation",
};

// Major Bangladesh cities with coordinates, so forms can offer a city picker instead
// of asking people to type raw latitude/longitude.
export const BD_CITIES: Array<{ name: string; lat: number; lng: number }> = [
  { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
  { name: "Khulna", lat: 22.8456, lng: 89.5403 },
  { name: "Rajshahi", lat: 24.3745, lng: 88.6042 },
  { name: "Sylhet", lat: 24.8949, lng: 91.8687 },
  { name: "Barisal", lat: 22.701, lng: 90.3535 },
  { name: "Rangpur", lat: 25.7439, lng: 89.2752 },
  { name: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  { name: "Comilla", lat: 23.4607, lng: 91.1809 },
  { name: "Narayanganj", lat: 23.6238, lng: 90.5 },
];

// Demo accounts for the one-click login buttons. The admin account comes from the
// backend's Prisma seed. Donor/Hospital demo accounts must be created once (register
// them normally, then verify the hospital as admin) using these same credentials —
// see README "Demo accounts" section.
export const DEMO_ACCOUNTS = {
  ADMIN: {
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@blooddonation.app",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "ChangeMe123!",
  },
  DONOR: {
    email: process.env.NEXT_PUBLIC_DEMO_DONOR_EMAIL ?? "demo.donor@raktosheba.app",
    password: process.env.NEXT_PUBLIC_DEMO_DONOR_PASSWORD ?? "DemoDonor123!",
  },
  HOSPITAL: {
    email: process.env.NEXT_PUBLIC_DEMO_HOSPITAL_EMAIL ?? "demo.hospital@raktosheba.app",
    password: process.env.NEXT_PUBLIC_DEMO_HOSPITAL_PASSWORD ?? "DemoHospital123!",
  },
} as const;
