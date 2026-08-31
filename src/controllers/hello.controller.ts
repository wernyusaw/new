import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ServiceTokens } from "../di/injection-tokens";
import type { AppConfig } from "../interfaces/app-config";
import type { HelloServicePort } from "../interfaces/hello-service.port";
import { mapGetHelloRequest } from "../mappers/request/hello-request.mapper";
import { mapSuccessResponse } from "../mappers/response/api-response.mapper";

@injectable()
export class HelloController {
  public constructor(
    @inject(ServiceTokens.HelloService) private readonly helloService: HelloServicePort,
    @inject(ServiceTokens.AppConfig) private readonly appConfig: AppConfig,
  ) {}

  public getHello(request: Request, response: Response): void {
    const input = mapGetHelloRequest(request, this.appConfig);
    const message = this.helloService.buildMessage(input.name);

    response.status(200).json(mapSuccessResponse(200, { message }));
  }
}
