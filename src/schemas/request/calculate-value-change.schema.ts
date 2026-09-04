import { z } from "zod";

export const calculateValueChangeSchema = z.object({
  currentValue: z.number(),
  changeBy: z.number(),
  operation: z.enum(["increase", "decrease"]),
});
