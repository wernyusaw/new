import { z } from "zod";

export const getHelloNameSchema = z.string().trim().min(1).max(100);
