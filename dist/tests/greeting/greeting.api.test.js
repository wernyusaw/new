"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
require("../../src/di/dependency-registry");
const Bootstrap_1 = require("../../Bootstrap");
(0, globals_1.describe)("GET /api/greeting", () => {
    (0, globals_1.it)("returns greeting response", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app)
            .get("/api/greeting")
            .query({ name: "Tom" });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toMatchObject({
            resultCode: 200,
            resultMessage: "success",
        });
        (0, globals_1.expect)(response.body.resultData).toHaveProperty("message");
    });
    (0, globals_1.it)("returns 404 when greeting by name is not found", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/api/greeting/UnknownName");
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body).toEqual({
            resultCode: 404,
            resultMessage: "Greeting not found",
        });
    });
    (0, globals_1.it)("returns 400 when greeting by name is blank", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app).get("/api/greeting/%20%20");
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toEqual({
            resultCode: 400,
            resultMessage: "Name is required",
        });
    });
});
