import { injectable } from "tsyringe";
import { inject } from "tsyringe";

import { ServiceTokens } from "../di/injection-tokens";
import type { GetGreetingByNameRequestDto } from "../dtos/request/greeting/get-greeting-by-name-request.dto";
import type { GetGreetingRequestDto } from "../dtos/request/greeting/get-greeting-request.dto";
import type { AppConfig } from "../interfaces/app-config";
import type { EventPublisherPort } from "../interfaces/event-publisher.port";
import type { GreetingRepositoryPort } from "../interfaces/greeting-repository.port";
import type { GreetingServicePort } from "../interfaces/greeting-service.port";
import { getGreetingMessage } from "../usecases/getGreetingMessageUsecase";

@injectable()
export class GreetingService implements GreetingServicePort {
  public constructor(
    @inject(ServiceTokens.GreetingRepository)
    private readonly greetingRepository: GreetingRepositoryPort,
    @inject(ServiceTokens.AppConfig)
    private readonly appConfig: AppConfig,
    @inject(ServiceTokens.EventPublisher)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  public async buildMessage(input: GetGreetingRequestDto): Promise<string> {
    const message = getGreetingMessage(input.name, this.appConfig.greetingStyle);

    await this.greetingRepository.saveGreeting(input.name, message);
    await this.eventPublisher.publishGreetingCreated({
      name: input.name,
      message,
      createdAt: new Date().toISOString(),
    });

    return message;
  }

  public async getGreetingByName(input: GetGreetingByNameRequestDto): Promise<string | null> {
    const foundMessage = await this.greetingRepository.getGreetingByName(input.name);

    if (foundMessage === null) {
      return null;
    }

    return `Message from ${input.name} is ${foundMessage}`;
  }

}
