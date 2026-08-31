import type { CalculateValueChangeRequestDto } from "../dtos/request/calculate/calculate-value-change-request.dto";
import type { CalculateValueChangeResponseDto } from "../dtos/response/calculate/calculate-value-change-response.dto";

export interface CalculateServicePort {
    calculateValueChange(input: CalculateValueChangeRequestDto): CalculateValueChangeResponseDto;
}