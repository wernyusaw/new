import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ServiceTokens } from "../di/injection-tokens";
import type { AppConfig } from "../interfaces/app-config";
import type { GreetingServicePort } from "../interfaces/greeting-service.port";
import { mapGetGreetingRequest, mapGetGreetingByNameRequest } from "../mappers/request/greeting-request.mapper";
import { mapErrorResponse, mapSuccessResponse } from "../mappers/response/api-response.mapper";

@injectable()
export class GreetingController {
  public constructor(
    @inject(ServiceTokens.GreetingService) private readonly greetingService: GreetingServicePort,
    @inject(ServiceTokens.AppConfig) private readonly appConfig: AppConfig,
  ) {}

  public async getGreeting(request: Request, response: Response): Promise<void> {
    const input = mapGetGreetingRequest(request, this.appConfig);

    try {
      const message = await this.greetingService.buildMessage(input);

      response.status(200).json(mapSuccessResponse(200, { message }));
    } catch (error: unknown) {
      console.error("Failed to build and persist greeting", error);
      response.status(500).json(mapErrorResponse(500, "Internal Server Error"));
    }
  }

  public async getGreetingByName(request: Request<{ name: string }>, response: Response): Promise<void> {
    const input = mapGetGreetingByNameRequest(request);

    if (input.name.length === 0) {
      response.status(400).json(mapErrorResponse(400, "Name is required"));
      return;
    }

    try {
      const message = await this.greetingService.getGreetingByName(input);

      if (message) {
        response.status(200).json(mapSuccessResponse(200, { message }));
      } else {
        response.status(404).json(mapErrorResponse(404, "Greeting not found"));
      }
    } catch (error: unknown) {
      console.error("Failed to retrieve greeting", error);
      response.status(500).json(mapErrorResponse(500, "Internal Server Error"));
    }
  }
}