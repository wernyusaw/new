import { injectable } from "tsyringe";
import type { CalculateValueChangeRequestDto } from "../dtos/request/calculate/calculate-value-change-request.dto";
import type { CalculateValueChangeResponseDto } from "../dtos/response/calculate/calculate-value-change-response.dto";
import type { CalculateServicePort } from "../interfaces/calculate-service.port";
import { calculateValueChangeUsecase } from "../usecases/calculateUsecase";

@injectable()
export class CalculateService implements CalculateServicePort {
  public calculateValueChange(input: CalculateValueChangeRequestDto): CalculateValueChangeResponseDto {
    return calculateValueChangeUsecase(input);
  }
}