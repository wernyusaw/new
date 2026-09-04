import { z } from "zod";

export const getGreetingByNameSchema = z.string().trim().min(1).max(100);
