import { z } from "zod";

import type { CreateProfileRequestDto } from "../../dtos/request/profile/create-profile-request.dto";
import type { UpdateProfileRequestDto } from "../../dtos/request/profile/update-profile-request.dto";
import type {
  CreateProfileRequestBodyInput,
  ProfileByIdRequestQueryInput,
  UpdateProfileRequestBodyInput,
} from "../../models/request/profile-request.model";

const nonEmptyStringSchema = z.string().trim().min(1);
const dateSchema = nonEmptyStringSchema
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  });
const profileStatusSchema = z.enum(["active", "inactive"]);
const profileAddressSchema = z.object({
  line1: nonEmptyStringSchema,
  line2: z.string().trim().optional(),
  city: nonEmptyStringSchema,
  state: nonEmptyStringSchema,
  postalCode: nonEmptyStringSchema,
  country: nonEmptyStringSchema,
});
const createProfileSchema = z.object({
  firstName: nonEmptyStringSchema,
  lastName: nonEmptyStringSchema,
  email: z.string().trim().email(),
  phone: nonEmptyStringSchema,
  dateOfBirth: dateSchema,
  status: profileStatusSchema,
  address: profileAddressSchema,
  preferences: z.object({
    allowMarketing: z.boolean(),
  }),
});
const updateProfileSchema = z.object({
  firstName: nonEmptyStringSchema.optional(),
  lastName: nonEmptyStringSchema.optional(),
  email: z.string().trim().email().optional(),
  phone: nonEmptyStringSchema.optional(),
  dateOfBirth: dateSchema.optional(),
  status: profileStatusSchema.optional(),
  address: profileAddressSchema.partial().optional(),
  preferences: z.object({ allowMarketing: z.boolean().optional() }).optional(),
}).refine((value) => Object.keys(value).length > 0);
const positiveIntegerSchema = z.coerce.number().int().positive();

function parsePositiveInteger(value: unknown): number | null {
  const result = positiveIntegerSchema.safeParse(value);

  return result.success ? result.data : null;
}

export function mapCreateProfileRequest(input: CreateProfileRequestBodyInput): CreateProfileRequestDto | null {
  const result = createProfileSchema.safeParse(input.body);

  return result.success ? result.data : null;
}

export function mapProfileByIdQueryRequest(input: ProfileByIdRequestQueryInput): number | null {
  return parsePositiveInteger(input.query.id);
}

export function mapUpdateProfileIdRequest(input: UpdateProfileRequestBodyInput): number | null {
  return parsePositiveInteger(input.body.id);
}

export function mapUpdateProfileRequest(input: UpdateProfileRequestBodyInput): UpdateProfileRequestDto | null {
  const result = updateProfileSchema.safeParse(input.body);

  return result.success ? result.data : null;
}
