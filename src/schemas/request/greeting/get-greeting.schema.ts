import { z } from "zod";

export const getGreetingNameSchema = z.string().trim().min(1).max(100);
