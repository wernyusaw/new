import type { CalculateValueChangeRequestBodyInput } from "../../models/request/calculate-value-change-request.model";
import type { CalculateValueChangeRequestDto } from "../../dtos/request/calculate/calculate-value-change-request.dto";

export function mapCalculateValueChangeRequest(
  input: CalculateValueChangeRequestBodyInput,
): CalculateValueChangeRequestDto | null {
  const { currentValue, changeBy, operation } = input.body;

  const isValidOperation = operation === "increase" || operation === "decrease";

  if (
    typeof currentValue !== "number"
    || !Number.isFinite(currentValue)
    || typeof changeBy !== "number"
    || !Number.isFinite(changeBy)
    || !isValidOperation
  ) {
    return null;
  }

  return {
    currentValue,
    changeBy,
    operation,
  };
}
