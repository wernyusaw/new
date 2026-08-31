"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateValueChangeUsecase = calculateValueChangeUsecase;
function calculateValueChangeUsecase(input) {
    const changedValue = input.operation === "increase"
        ? input.currentValue + input.changeBy
        : input.currentValue - input.changeBy;
    return {
        operation: input.operation,
        originalValue: input.currentValue,
        changeBy: input.changeBy,
        changedValue,
    };
}
