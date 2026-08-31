"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCalculateValueChangeRequest = mapCalculateValueChangeRequest;
function mapCalculateValueChangeRequest(input) {
    const { currentValue, changeBy, operation } = input.body;
    const isValidOperation = operation === "increase" || operation === "decrease";
    if (typeof currentValue !== "number"
        || !Number.isFinite(currentValue)
        || typeof changeBy !== "number"
        || !Number.isFinite(changeBy)
        || !isValidOperation) {
        return null;
    }
    return {
        currentValue,
        changeBy,
        operation,
    };
}
