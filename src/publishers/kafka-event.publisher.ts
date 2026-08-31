import { Kafka, type Producer } from "kafkajs";
import { inject, injectable } from "tsyringe";

import { ServiceTokens } from "../di/injection-tokens";
import type { AppConfig } from "../interfaces/app-config";
import type { EventPublisherPort, GreetingCreatedEvent } from "../interfaces/event-publisher.port";

@injectable()
export class KafkaEventPublisher implements EventPublisherPort {
  private readonly producer: Producer;
  private isConnected = false;

  public constructor(@inject(ServiceTokens.AppConfig) private readonly appConfig: AppConfig) {
    const kafka = new Kafka({
      clientId: appConfig.kafkaClientId,
      brokers: appConfig.kafkaBrokers,
    });

    this.producer = kafka.producer();
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.appConfig.kafkaBrokers.length === 0) {
      throw new Error("KAFKA_BROKERS must not be empty when Kafka is enabled");
    }

    await this.producer.connect();
    this.isConnected = true;
  }

  public async publishGreetingCreated(event: GreetingCreatedEvent): Promise<void> {
    await this.connect();

    console.log(
      `[Kafka] Publishing greeting.created topic=${this.appConfig.kafkaTopicGreetingCreated} name=${event.name}`,
    );

    const result = await this.producer.send({
      topic: this.appConfig.kafkaTopicGreetingCreated,
      messages: [
        {
          key: event.name,
          value: JSON.stringify({
            eventType: "greeting.created",
            ...event,
          }),
        },
      ],
    });

    console.log(
      `[Kafka] Published greeting.created topic=${this.appConfig.kafkaTopicGreetingCreated} name=${event.name} partitions=${result
        .map((metadata) => `${metadata.partition}@${metadata.baseOffset}`)
        .join(",")}`,
    );
  }
}
