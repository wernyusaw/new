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
exports.GreetingService = void 0;
const tsyringe_1 = require("tsyringe");
const tsyringe_2 = require("tsyringe");
const injection_tokens_1 = require("../di/injection-tokens");
const getGreetingMessage_1 = require("../usecases/getGreetingMessage");
let GreetingService = class GreetingService {
    constructor(greetingRepository, appConfig) {
        this.greetingRepository = greetingRepository;
        this.appConfig = appConfig;
    }
    async buildMessage(input) {
        const message = (0, getGreetingMessage_1.getGreetingMessage)(input.name, this.appConfig.greetingStyle);
        await this.greetingRepository.saveGreeting(input.name, message);
        return message;
    }
    async getGreetingByName(input) {
        const foundMessage = await this.greetingRepository.getGreetingByName(input.name);
        if (foundMessage === null) {
            return null;
        }
        return `Message from ${input.name} is ${foundMessage}`;
    }
};
exports.GreetingService = GreetingService;
exports.GreetingService = GreetingService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_2.inject)(injection_tokens_1.ServiceTokens.GreetingRepository)),
    __param(1, (0, tsyringe_2.inject)(injection_tokens_1.ServiceTokens.AppConfig)),
    __metadata("design:paramtypes", [Object, Object])
], GreetingService);
