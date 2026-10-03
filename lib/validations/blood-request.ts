import { z } from "zod";
import { BloodGroup, UrgencyLevel } from "@/types";

export const createBloodRequestSchema = z.object({
  patientName: z.string().min(2, "Too short").max(100),
  patientAge: z.coerce.number().int().positive().max(120).optional(),
  bloodGroup: z.nativeEnum(BloodGroup, { errorMap: () => ({ message: "Select a blood group" }) }),
  unitsNeeded: z.coerce.number().int().positive().max(20),
  urgency: z.nativeEnum(UrgencyLevel, { errorMap: () => ({ message: "Select urgency" }) }),
  reason: z.string().max(500).optional(),
  requiredBy: z.string().min(1, "Required").refine((v) => new Date(v).getTime() > Date.now(), "Must be in the future"),
  city: z.string().min(2, "Select a city"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});
export type CreateBloodRequestInput = z.infer<typeof createBloodRequestSchema>;
