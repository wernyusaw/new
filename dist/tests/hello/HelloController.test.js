"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const hello_controller_1 = require("../../src/controllers/hello.controller");
const appConfigMock = {
    defaultName: "Saw",
    greetingStyle: "casual",
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
function buildMockResponse() {
    return {
        status: globals_1.jest.fn().mockReturnThis(),
        json: globals_1.jest.fn().mockReturnThis(),
    };
}
(0, globals_1.describe)("HelloController", () => {
    (0, globals_1.it)("returns 200 with the built hello message", () => {
        // Arrange
        const helloServiceMock = {
            buildMessage: globals_1.jest.fn().mockReturnValue("Hello, Tom"),
        };
        const controller = new hello_controller_1.HelloController(helloServiceMock, appConfigMock);
        const request = { query: { name: "Tom" } };
        const response = buildMockResponse();
        // Act
        controller.getHello(request, response);
        // Assert
        (0, globals_1.expect)(helloServiceMock.buildMessage).toHaveBeenCalledWith("Tom");
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultCode: 200, resultData: { message: "Hello, Tom" } }));
    });
    (0, globals_1.it)("falls back to the configured default name when query.name is missing", () => {
        // Arrange
        const helloServiceMock = {
            buildMessage: globals_1.jest.fn().mockReturnValue("Hello, Saw"),
        };
        const controller = new hello_controller_1.HelloController(helloServiceMock, appConfigMock);
        const request = { query: {} };
        const response = buildMockResponse();
        // Act
        controller.getHello(request, response);
        // Assert
        (0, globals_1.expect)(helloServiceMock.buildMessage).toHaveBeenCalledWith("Saw");
    });
});
