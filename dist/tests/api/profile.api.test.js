"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
require("../../src/di/dependency-registry");
const Bootstrap_1 = require("../../Bootstrap");
(0, globals_1.describe)("Profile Master API", () => {
    (0, globals_1.it)("creates and fetches a profile", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const createResponse = await (0, supertest_1.default)(app)
            .post("/api/profiles")
            .send({
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            phone: "0800000000",
            dateOfBirth: "1990-01-20",
            status: "active",
            address: {
                line1: "123 Main St",
                city: "Bangkok",
                state: "Bangkok",
                postalCode: "10100",
                country: "Thailand",
            },
            preferences: {
                allowMarketing: true,
            },
        });
        (0, globals_1.expect)(createResponse.status).toBe(201);
        (0, globals_1.expect)(createResponse.body).toHaveProperty("id");
        (0, globals_1.expect)(createResponse.body).toMatchObject({
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            status: "active",
            version: 1,
        });
        const profileId = createResponse.body.id;
        const getResponse = await (0, supertest_1.default)(app).get(`/api/profiles/${profileId}`);
        (0, globals_1.expect)(getResponse.status).toBe(200);
        (0, globals_1.expect)(getResponse.body).toMatchObject({
            id: profileId,
            firstName: "Alice",
            preferences: {
                allowMarketing: true,
            },
        });
    });
    (0, globals_1.it)("updates an active profile with POST", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const createResponse = await (0, supertest_1.default)(app)
            .post("/api/profiles")
            .send({
            firstName: "Bob",
            lastName: "Lee",
            email: "bob@example.com",
            phone: "0811111111",
            dateOfBirth: "1988-02-10",
            status: "active",
            address: {
                line1: "55 New Rd",
                city: "Chiang Mai",
                state: "Chiang Mai",
                postalCode: "50000",
                country: "Thailand",
            },
            preferences: {
                allowMarketing: false,
            },
        });
        const profileId = createResponse.body.id;
        const updateResponse = await (0, supertest_1.default)(app)
            .post(`/api/profiles/${profileId}/update`)
            .send({
            firstName: "Robert",
            preferences: {
                allowMarketing: true,
            },
        });
        (0, globals_1.expect)(updateResponse.status).toBe(200);
        (0, globals_1.expect)(updateResponse.body).toMatchObject({
            id: profileId,
            firstName: "Robert",
            preferences: {
                allowMarketing: true,
            },
        });
        (0, globals_1.expect)(updateResponse.body.version).toBeGreaterThan(1);
    });
    (0, globals_1.it)("rejects update for inactive profile", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const createResponse = await (0, supertest_1.default)(app)
            .post("/api/profiles")
            .send({
            firstName: "Carol",
            lastName: "Tan",
            email: "carol@example.com",
            phone: "0822222222",
            dateOfBirth: "1985-03-01",
            status: "inactive",
            address: {
                line1: "77 Park",
                city: "Phuket",
                state: "Phuket",
                postalCode: "83000",
                country: "Thailand",
            },
            preferences: {
                allowMarketing: false,
            },
        });
        const profileId = createResponse.body.id;
        const updateResponse = await (0, supertest_1.default)(app)
            .post(`/api/profiles/${profileId}/update`)
            .send({
            phone: "0899999999",
        });
        (0, globals_1.expect)(updateResponse.status).toBe(409);
        (0, globals_1.expect)(updateResponse.body).toEqual({
            message: "Inactive profile cannot be updated",
        });
    });
    (0, globals_1.it)("returns 400 for invalid create payload", async () => {
        const app = (0, Bootstrap_1.createApp)();
        const response = await (0, supertest_1.default)(app)
            .post("/api/profiles")
            .send({
            firstName: "OnlyName",
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body).toEqual({
            message: "Invalid profile payload",
        });
    });
});
