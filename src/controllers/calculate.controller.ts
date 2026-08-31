import type { Request, Response } from "express";
import { mapCalculateValueChangeRequest } from "../mappers/request/calculate-request.mapper";
import { mapErrorResponse, mapSuccessResponse } from "../mappers/response/api-response.mapper";
import type { CalculateServicePort } from "../interfaces/calculate-service.port";
import { inject, injectable } from "tsyringe";
import { ServiceTokens } from "../di/injection-tokens";
import type { AppConfig } from "../interfaces/app-config";

@injectable()  
export class CalculateController {

public constructor(
        @inject(ServiceTokens.AppConfig) private readonly appConfig: AppConfig,
        @inject(ServiceTokens.CalculateService) private readonly calculateService: CalculateServicePort,
    ) {}

  public calculateValueChange(request: Request, response: Response): void {
    const input = mapCalculateValueChangeRequest(request);

    if (input === null) {
      response.status(400).json(mapErrorResponse(400, "currentValue, changeBy and operation are required"));
      return;
    }

    const result = this.calculateService.calculateValueChange(input);
    response.status(200).json(mapSuccessResponse(200, result));
  }
}