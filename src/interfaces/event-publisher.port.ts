export interface GreetingCreatedEvent {
  name: string;
  message: string;
  createdAt: string;
}

export interface EventPublisherPort {
  connect(): Promise<void>;
  publishGreetingCreated(event: GreetingCreatedEvent): Promise<void>;
}
