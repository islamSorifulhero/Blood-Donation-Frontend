import { z } from "zod";
import { BloodGroup, Gender } from "@/types";

const password = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Needs an uppercase letter")
  .regex(/[a-z]/, "Needs a lowercase letter")
  .regex(/[0-9]/, "Needs a number");

const phone = z.string().regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerDonorSchema = z.object({
  name: z.string().min(2, "Too short").max(100),
  email: z.string().email("Enter a valid email"),
  phone,
  password,
  bloodGroup: z.nativeEnum(BloodGroup, { errorMap: () => ({ message: "Select a blood group" }) }),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: "Select a gender" }) }),
  weightKg: z.coerce.number().positive("Must be positive").max(400),
  address: z.string().min(3, "Too short"),
  city: z.string().min(2, "Too short"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});
export type RegisterDonorInput = z.infer<typeof registerDonorSchema>;

export const registerHospitalSchema = z.object({
  name: z.string().min(2, "Too short").max(100),
  email: z.string().email("Enter a valid email"),
  phone,
  password,
  hospitalName: z.string().min(2, "Too short").max(150),
  registrationNumber: z.string().min(2, "Too short").max(100),
  address: z.string().min(3, "Too short"),
  city: z.string().min(2, "Too short"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});
export type RegisterHospitalInput = z.infer<typeof registerHospitalSchema>;
