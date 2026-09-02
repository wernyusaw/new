"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
require("../../src/di/dependency-registry");
const Bootstrap_1 = require("../../Bootstrap");
(0, globals_1.describe)("POST /api/calculate", () => {
    (0, globals_1.it)("returns calculated value", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app)
            .post("/api/calculate")
            .send({
            currentValue: 100,
            changeBy: 15,
            operation: "decrease",
        });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toEqual({
            resultCode: 200,
            resultMessage: "success",
            resultData: {
                operation: "decrease",
                originalValue: 100,
                changeBy: 15,
                changedValue: 85,
            },
        });
    });
    (0, globals_1.it)("returns calculated value for increase operation", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app)
            .post("/api/calculate")
            .send({
            currentValue: 100,
            changeBy: 15,
            operation: "increase",
        });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toEqual({
            resultCode: 200,
            resultMessage: "success",
            resultData: {
                operation: "increase",
                originalValue: 100,
                changeBy: 15,
                changedValue: 115,
            },
        });
    });
    (0, globals_1.it)("returns 400 for invalid payload", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app)
            .post("/api/calculate")
            .send({
            currentValue: "100",
            operation: "increase",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toEqual({
            resultCode: 400,
            resultMessage: "currentValue, changeBy and operation are required",
        });
    });
});
