import { injectable } from "tsyringe";

import type { EventPublisherPort, GreetingCreatedEvent } from "../interfaces/event-publisher.port";

@injectable()
export class NoopEventPublisher implements EventPublisherPort {
  public async connect(): Promise<void> {
    return Promise.resolve();
  }

  public async publishGreetingCreated(_event: GreetingCreatedEvent): Promise<void> {
    return Promise.resolve();
  }
}
