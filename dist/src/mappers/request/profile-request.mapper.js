"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCreateProfileRequest = mapCreateProfileRequest;
exports.mapProfileByIdQueryRequest = mapProfileByIdQueryRequest;
exports.mapUpdateProfileIdRequest = mapUpdateProfileIdRequest;
exports.mapUpdateProfileRequest = mapUpdateProfileRequest;
const zod_1 = require("zod");
const nonEmptyStringSchema = zod_1.z.string().trim().min(1);
const dateSchema = nonEmptyStringSchema
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
});
const profileStatusSchema = zod_1.z.enum(["active", "inactive"]);
const profileAddressSchema = zod_1.z.object({
    line1: nonEmptyStringSchema,
    line2: zod_1.z.string().trim().optional(),
    city: nonEmptyStringSchema,
    state: nonEmptyStringSchema,
    postalCode: nonEmptyStringSchema,
    country: nonEmptyStringSchema,
});
const createProfileSchema = zod_1.z.object({
    firstName: nonEmptyStringSchema,
    lastName: nonEmptyStringSchema,
    email: zod_1.z.string().trim().email(),
    phone: nonEmptyStringSchema,
    dateOfBirth: dateSchema,
    status: profileStatusSchema,
    address: profileAddressSchema,
    preferences: zod_1.z.object({
        allowMarketing: zod_1.z.boolean(),
    }),
});
const updateProfileSchema = zod_1.z.object({
    firstName: nonEmptyStringSchema.optional(),
    lastName: nonEmptyStringSchema.optional(),
    email: zod_1.z.string().trim().email().optional(),
    phone: nonEmptyStringSchema.optional(),
    dateOfBirth: dateSchema.optional(),
    status: profileStatusSchema.optional(),
    address: profileAddressSchema.partial().optional(),
    preferences: zod_1.z.object({ allowMarketing: zod_1.z.boolean().optional() }).optional(),
}).refine((value) => Object.keys(value).length > 0);
const positiveIntegerSchema = zod_1.z.coerce.number().int().positive();
function parsePositiveInteger(value) {
    const result = positiveIntegerSchema.safeParse(value);
    return result.success ? result.data : null;
}
function mapCreateProfileRequest(input) {
    const result = createProfileSchema.safeParse(input.body);
    return result.success ? result.data : null;
}
function mapProfileByIdQueryRequest(input) {
    return parsePositiveInteger(input.query.id);
}
function mapUpdateProfileIdRequest(input) {
    return parsePositiveInteger(input.body.id);
}
function mapUpdateProfileRequest(input) {
    const result = updateProfileSchema.safeParse(input.body);
    return result.success ? result.data : null;
}
