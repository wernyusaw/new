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
exports.HelloController = void 0;
const tsyringe_1 = require("tsyringe");
const injection_tokens_1 = require("../di/injection-tokens");
const hello_request_mapper_1 = require("../mappers/request/hello-request.mapper");
const api_response_mapper_1 = require("../mappers/response/api-response.mapper");
let HelloController = class HelloController {
    constructor(helloService, appConfig) {
        this.helloService = helloService;
        this.appConfig = appConfig;
    }
    getHello(request, response) {
        const input = (0, hello_request_mapper_1.mapGetHelloRequest)(request, this.appConfig);
        const message = this.helloService.buildMessage(input.name);
        response.json((0, api_response_mapper_1.mapMessageResponse)(message));
    }
};
exports.HelloController = HelloController;
exports.HelloController = HelloController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.HelloService)),
    __param(1, (0, tsyringe_1.inject)(injection_tokens_1.ServiceTokens.AppConfig)),
    __metadata("design:paramtypes", [Object, Object])
], HelloController);
