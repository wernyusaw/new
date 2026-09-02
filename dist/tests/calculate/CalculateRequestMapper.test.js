"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const calculate_request_mapper_1 = require("../../src/mappers/request/calculate-request.mapper");
(0, globals_1.describe)("calculate request mapper", () => {
    (0, globals_1.it)("maps a valid increase request", () => {
        const request = { body: { currentValue: 100, changeBy: 10, operation: "increase" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toEqual({
            currentValue: 100,
            changeBy: 10,
            operation: "increase",
        });
    });
    (0, globals_1.it)("maps a valid decrease request", () => {
        const request = { body: { currentValue: 100, changeBy: 10, operation: "decrease" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toEqual({
            currentValue: 100,
            changeBy: 10,
            operation: "decrease",
        });
    });
    (0, globals_1.it)("returns null when currentValue is not a number", () => {
        const request = { body: { currentValue: "100", changeBy: 10, operation: "increase" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toBeNull();
    });
    (0, globals_1.it)("returns null when changeBy is not a number", () => {
        const request = { body: { currentValue: 100, changeBy: "10", operation: "increase" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toBeNull();
    });
    (0, globals_1.it)("returns null when currentValue is not finite", () => {
        const request = { body: { currentValue: Number.POSITIVE_INFINITY, changeBy: 10, operation: "increase" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toBeNull();
    });
    (0, globals_1.it)("returns null when changeBy is not finite", () => {
        const request = { body: { currentValue: 100, changeBy: Number.NaN, operation: "increase" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toBeNull();
    });
    (0, globals_1.it)("returns null when operation is invalid", () => {
        const request = { body: { currentValue: 100, changeBy: 10, operation: "multiply" } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toBeNull();
    });
    (0, globals_1.it)("returns null when operation is missing", () => {
        const request = { body: { currentValue: 100, changeBy: 10 } };
        (0, globals_1.expect)((0, calculate_request_mapper_1.mapCalculateValueChangeRequest)(request)).toBeNull();
    });
});
