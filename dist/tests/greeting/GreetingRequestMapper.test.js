"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const greeting_request_mapper_1 = require("../../src/mappers/request/greeting-request.mapper");
const appConfigMock = {
    defaultName: "Saw",
    greetingStyle: "formal",
    dbHost: "localhost",
    dbPort: 3306,
    dbUser: "app_user",
    dbPassword: "app_password",
    dbName: "app_db",
    kafkaEnabled: false,
    kafkaBrokers: ["localhost:9092"],
    kafkaClientId: "simple-ts-express",
    kafkaTopicGreetingCreated: "greeting.created",
};
(0, globals_1.describe)("greeting request mapper", () => {
    (0, globals_1.it)("uses default name when query.name is missing", () => {
        const request = {
            query: {},
        };
        (0, globals_1.expect)((0, greeting_request_mapper_1.mapGetGreetingRequest)(request, appConfigMock)).toEqual({ name: "Saw" });
    });
    (0, globals_1.it)("trims query.name and returns default when blank", () => {
        const request = {
            query: { name: "   " },
        };
        (0, globals_1.expect)((0, greeting_request_mapper_1.mapGetGreetingRequest)(request, appConfigMock)).toEqual({ name: "Saw" });
    });
    (0, globals_1.it)("maps path param name and trims whitespace", () => {
        const request = {
            params: { name: "  Tom  " },
        };
        (0, globals_1.expect)((0, greeting_request_mapper_1.mapGetGreetingByNameRequest)(request)).toEqual({ name: "Tom" });
    });
    (0, globals_1.it)("returns an empty path name when it exceeds the database limit", () => {
        const request = {
            params: { name: "a".repeat(101) },
        };
        (0, globals_1.expect)((0, greeting_request_mapper_1.mapGetGreetingByNameRequest)(request)).toEqual({ name: "" });
    });
});
