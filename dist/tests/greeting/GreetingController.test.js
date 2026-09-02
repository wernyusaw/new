"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const greeting_controller_1 = require("../../src/controllers/greeting.controller");
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
(0, globals_1.describe)("GreetingController", () => {
    (0, globals_1.describe)("getGreeting", () => {
        (0, globals_1.it)("returns 200 with the built greeting message", async () => {
            // Arrange
            const greetingServiceMock = {
                buildMessage: globals_1.jest.fn().mockResolvedValue("Greetings, Tom"),
                getGreetingByName: globals_1.jest.fn(),
            };
            const controller = new greeting_controller_1.GreetingController(greetingServiceMock, appConfigMock);
            const request = { query: { name: "Tom" } };
            const response = buildMockResponse();
            // Act
            await controller.getGreeting(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
            (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultData: { message: "Greetings, Tom" } }));
        });
        (0, globals_1.it)("returns 500 when the service throws", async () => {
            // Arrange
            const greetingServiceMock = {
                buildMessage: globals_1.jest.fn().mockRejectedValue(new Error("db down")),
                getGreetingByName: globals_1.jest.fn(),
            };
            const controller = new greeting_controller_1.GreetingController(greetingServiceMock, appConfigMock);
            const request = { query: { name: "Tom" } };
            const response = buildMockResponse();
            // Act
            await controller.getGreeting(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(500);
            (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultCode: 500 }));
        });
    });
    (0, globals_1.describe)("getGreetingByName", () => {
        (0, globals_1.it)("returns 400 when name is empty", async () => {
            // Arrange
            const greetingServiceMock = {
                buildMessage: globals_1.jest.fn(),
                getGreetingByName: globals_1.jest.fn(),
            };
            const controller = new greeting_controller_1.GreetingController(greetingServiceMock, appConfigMock);
            const request = { params: { name: "" } };
            const response = buildMockResponse();
            // Act
            await controller.getGreetingByName(request, response);
            // Assert
            (0, globals_1.expect)(greetingServiceMock.getGreetingByName).not.toHaveBeenCalled();
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        });
        (0, globals_1.it)("returns 200 with the message when found", async () => {
            // Arrange
            const greetingServiceMock = {
                buildMessage: globals_1.jest.fn(),
                getGreetingByName: globals_1.jest.fn().mockResolvedValue("Message from Tom is Greetings, Tom"),
            };
            const controller = new greeting_controller_1.GreetingController(greetingServiceMock, appConfigMock);
            const request = { params: { name: "Tom" } };
            const response = buildMockResponse();
            // Act
            await controller.getGreetingByName(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
            (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultData: { message: "Message from Tom is Greetings, Tom" } }));
        });
        (0, globals_1.it)("returns 404 when no greeting is found", async () => {
            // Arrange
            const greetingServiceMock = {
                buildMessage: globals_1.jest.fn(),
                getGreetingByName: globals_1.jest.fn().mockResolvedValue(null),
            };
            const controller = new greeting_controller_1.GreetingController(greetingServiceMock, appConfigMock);
            const request = { params: { name: "Unknown" } };
            const response = buildMockResponse();
            // Act
            await controller.getGreetingByName(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(404);
        });
        (0, globals_1.it)("returns 500 when the service throws", async () => {
            // Arrange
            const greetingServiceMock = {
                buildMessage: globals_1.jest.fn(),
                getGreetingByName: globals_1.jest.fn().mockRejectedValue(new Error("db down")),
            };
            const controller = new greeting_controller_1.GreetingController(greetingServiceMock, appConfigMock);
            const request = { params: { name: "Tom" } };
            const response = buildMockResponse();
            // Act
            await controller.getGreetingByName(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(500);
        });
    });
});
