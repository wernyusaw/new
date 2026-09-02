import { z } from "zod";

import type { CalculateValueChangeRequestBodyInput } from "../../models/request/calculate-value-change-request.model";
import type { CalculateValueChangeRequestDto } from "../../dtos/request/calculate/calculate-value-change-request.dto";

const calculateValueChangeSchema = z.object({
  currentValue: z.number(),
  changeBy: z.number(),
  operation: z.enum(["increase", "decrease"]),
});

export function mapCalculateValueChangeRequest(
  input: CalculateValueChangeRequestBodyInput,
): CalculateValueChangeRequestDto | null {
  const result = calculateValueChangeSchema.safeParse(input.body);

  return result.success ? result.data : null;
}
