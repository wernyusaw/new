import { z } from "zod";

import {
  nonEmptyProfileStringSchema,
  profileAddressSchema,
  profileDateSchema,
  profileStatusSchema,
} from "./profile-common.schema";

export const updateProfileSchema = z.object({
  firstName: nonEmptyProfileStringSchema.optional(),
  lastName: nonEmptyProfileStringSchema.optional(),
  email: z.string().trim().email().optional(),
  phone: nonEmptyProfileStringSchema.optional(),
  dateOfBirth: profileDateSchema.optional(),
  status: profileStatusSchema.optional(),
  address: profileAddressSchema.partial().optional(),
  preferences: z.object({ allowMarketing: z.boolean().optional() }).optional(),
}).refine((value) => Object.keys(value).length > 0);
