"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateService = void 0;
const tsyringe_1 = require("tsyringe");
const calculateUsecase_1 = require("../usecases/calculateUsecase");
let CalculateService = class CalculateService {
    calculateValueChange(input) {
        return (0, calculateUsecase_1.calculateValueChangeUsecase)(input);
    }
};
exports.CalculateService = CalculateService;
exports.CalculateService = CalculateService = __decorate([
    (0, tsyringe_1.injectable)()
], CalculateService);
