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
exports.GreetingController = void 0;
const tsyringe_1 = require("tsyringe");
const injection_tokens_1 = require("../di/injection-tokens");
const greeting_request_mapper_1 = require("../mappers/request/greeting-request.mapper");
const api_response_mapper_1 = require("../mappers/response/api-response.mapper");
let GreetingController = class GreetingController {
    constructor(greetingService, appConfig) {
        this.greetingService = greetingService;
        this.appConfig = appConfig;
    }
    async getGreeting(request, response) {
        const input = (0, greeting_request_mapper_1.mapGetGreetingRequest)(request, this.appConfig);
        try {
            const message = await this.greetingService.buildMessage(input);
            response.status(200).json((0, api_response_mapper_1.mapSuccessResponse)(200, { message }));
        }
        catch (error) {
            console.error("Failed to build and persist greeting", error);
            response.status(500).json((0, api_response_mapper_1.mapErrorResponse)(500, "Internal Server Error"));
        }
    }
    async getGreetingByName(request, response) {
        const input = (0, greeting_request_mapper_1.mapGetGreetingByNameRequest)(request);
        if (input.name.length === 0) {
            response.status(400).json((0, api_response_mapper_1.mapErrorResponse)(400, "Name is required"));
            return;
        }
        try {
            const message = await this.greetingService.getGreetingByName(input);
            if (message) {
                response.status(200).json((0, api_response_mapper_1.mapSuccessResponse)(200, { message }));
            }
            else {
                response.status(404).json((0, api_response_mapper_1.mapErrorResponse)(404, "Greeting not found"));
            }
        }
        catch (error) {
            console.error("Failed to retrieve greeting", error);
            response.status(500).json((0, api_response_mapper_1.mapErrorResponse)(500, "Internal Server Error"));
        }
    }
};
exports.GreetingController = GreetingController;
exports.GreetingController = GreetingController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.GreetingService)),
    __param(1, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.AppConfig)),
    __metadata("design:paramtypes", [Object, Object])
], GreetingController);
