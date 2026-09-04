import { z } from "zod";

import { BANGKOK_TIME_ZONE, DATE_FORMAT } from "../../../constants/date-time";

export const nonEmptyProfileStringSchema = z.string().trim().min(1);

export const profileDateSchema = nonEmptyProfileStringSchema
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: `Date must use ${DATE_FORMAT} format`,
  })
  .refine((value) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

    if (!match) {
      return false;
    }

    const [, day, month, year] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: BANGKOK_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const parts = Object.fromEntries(dateParts.map(({ type, value: partValue }) => [type, partValue]));

    return parts.day === day && parts.month === month && parts.year === year;
  });

export const profileStatusSchema = z.enum(["active", "inactive"]);

export const profileAddressSchema = z.object({
  line1: nonEmptyProfileStringSchema,
  line2: z.string().trim().optional(),
  city: nonEmptyProfileStringSchema,
  state: nonEmptyProfileStringSchema,
  postalCode: nonEmptyProfileStringSchema,
  country: nonEmptyProfileStringSchema,
});
