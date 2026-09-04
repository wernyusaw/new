import { z } from "zod";

import {
  nonEmptyProfileStringSchema,
  profileAddressSchema,
  profileDateSchema,
  profileStatusSchema,
} from "./profile-common.schema";

export const createProfileSchema = z.object({
  firstName: nonEmptyProfileStringSchema,
  lastName: nonEmptyProfileStringSchema,
  email: z.string().trim().email(),
  phone: nonEmptyProfileStringSchema,
  dateOfBirth: profileDateSchema,
  status: profileStatusSchema,
  address: profileAddressSchema,
  preferences: z.object({
    allowMarketing: z.boolean(),
  }),
});
