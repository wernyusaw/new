import type { CalculateValueChangeRequestDto } from "../dtos/request/calculate/calculate-value-change-request.dto";
import type { CalculateValueChangeResponseDto } from "../dtos/response/calculate/calculate-value-change-response.dto";

export function calculateValueChangeUsecase(
	input: CalculateValueChangeRequestDto,
): CalculateValueChangeResponseDto {
	const changedValue = input.operation === "increase"
		? input.currentValue + input.changeBy
		: input.currentValue - input.changeBy;

	return {
		operation: input.operation,
		originalValue: input.currentValue,
		changeBy: input.changeBy,
		changedValue,
	};
}
