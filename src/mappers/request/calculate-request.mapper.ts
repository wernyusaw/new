import type { CalculateValueChangeRequestBodyInput } from "../../models/request/calculate-value-change-request.model";
import type { CalculateValueChangeRequestDto } from "../../dtos/request/calculate/calculate-value-change-request.dto";
import { calculateValueChangeSchema } from "../../schemas/request/calculate-value-change.schema";

export function mapCalculateValueChangeRequest(
  input: CalculateValueChangeRequestBodyInput,
): CalculateValueChangeRequestDto | null {
  const result = calculateValueChangeSchema.safeParse(input.body);

  return result.success ? result.data : null;
}
