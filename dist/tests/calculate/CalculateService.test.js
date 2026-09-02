"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const calculate_service_1 = require("../../src/services/calculate.service");
const calculateUsecaseModule = __importStar(require("../../src/usecases/calculateUsecase"));
globals_1.jest.mock("../../src/usecases/calculateUsecase");
(0, globals_1.describe)("CalculateService", () => {
    (0, globals_1.it)("delegates calculateValueChange to the usecase and returns its result", () => {
        // Arrange
        const input = { currentValue: 10, changeBy: 5, operation: "increase" };
        const expected = { operation: "increase", originalValue: 10, changeBy: 5, changedValue: 15 };
        globals_1.jest.spyOn(calculateUsecaseModule, "calculateValueChangeUsecase").mockReturnValue(expected);
        const service = new calculate_service_1.CalculateService();
        // Act
        const result = service.calculateValueChange(input);
        // Assert
        (0, globals_1.expect)(calculateUsecaseModule.calculateValueChangeUsecase).toHaveBeenCalledWith(input);
        (0, globals_1.expect)(result).toEqual(expected);
    });
});
