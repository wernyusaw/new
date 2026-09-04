import { z } from "zod";

export const profileIdSchema = z.coerce.number().int().positive();
