"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaEventPublisher = void 0;
const kafkajs_1 = require("kafkajs");
const tsyringe_1 = require("tsyringe");
const injection_tokens_1 = require("../di/injection-tokens");
let KafkaEventPublisher = class KafkaEventPublisher {
    constructor(appConfig) {
        this.appConfig = appConfig;
        this.isConnected = false;
        const kafka = new kafkajs_1.Kafka({
            clientId: appConfig.kafkaClientId,
            brokers: appConfig.kafkaBrokers,
        });
        this.producer = kafka.producer();
    }
    async connect() {
        if (this.isConnected) {
            return;
        }
        if (this.appConfig.kafkaBrokers.length === 0) {
            throw new Error("KAFKA_BROKERS must not be empty when Kafka is enabled");
        }
        await this.producer.connect();
        this.isConnected = true;
    }
    async publishGreetingCreated(event) {
        await this.connect();
        console.log(`[Kafka] Publishing greeting.created topic=${this.appConfig.kafkaTopicGreetingCreated} name=${event.name}`);
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
        console.log(`[Kafka] Published greeting.created topic=${this.appConfig.kafkaTopicGreetingCreated} name=${event.name} partitions=${result
            .map((metadata) => `${metadata.partition}@${metadata.baseOffset}`)
            .join(",")}`);
    }
};
exports.KafkaEventPublisher = KafkaEventPublisher;
exports.KafkaEventPublisher = KafkaEventPublisher = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.AppConfig)),
    __metadata("design:paramtypes", [Object])
], KafkaEventPublisher);
