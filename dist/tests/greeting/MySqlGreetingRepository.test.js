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
const mysql_greeting_repository_1 = require("../../src/repositories/mysql-greeting.repository");
const mysqlModule = __importStar(require("../../src/db/mysql"));
globals_1.jest.mock("../../src/db/mysql");
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
(0, globals_1.describe)("MySqlGreetingRepository", () => {
    let executeMock;
    (0, globals_1.beforeEach)(() => {
        executeMock = globals_1.jest.fn();
        globals_1.jest.spyOn(mysqlModule, "getMySqlPool").mockResolvedValue({ execute: executeMock });
    });
    (0, globals_1.it)("inserts a greeting using a parameterized query", async () => {
        // Arrange
        executeMock.mockResolvedValue([{}]);
        const repository = new mysql_greeting_repository_1.MySqlGreetingRepository(appConfigMock);
        // Act
        await repository.saveGreeting("Tom", "Hello, Tom");
        // Assert
        (0, globals_1.expect)(executeMock).toHaveBeenCalledWith(globals_1.expect.stringContaining("INSERT INTO greetings"), ["Tom", "Hello, Tom"]);
    });
    (0, globals_1.it)("returns the message when a greeting is found", async () => {
        // Arrange
        executeMock.mockResolvedValue([[{ message: "Hello, Tom" }]]);
        const repository = new mysql_greeting_repository_1.MySqlGreetingRepository(appConfigMock);
        // Act
        const result = await repository.getGreetingByName("Tom");
        // Assert
        (0, globals_1.expect)(executeMock).toHaveBeenCalledWith(globals_1.expect.stringContaining("SELECT message FROM greetings"), ["Tom"]);
        (0, globals_1.expect)(result).toBe("Hello, Tom");
    });
    (0, globals_1.it)("returns null when no greeting is found", async () => {
        // Arrange
        executeMock.mockResolvedValue([[]]);
        const repository = new mysql_greeting_repository_1.MySqlGreetingRepository(appConfigMock);
        // Act
        const result = await repository.getGreetingByName("Unknown");
        // Assert
        (0, globals_1.expect)(result).toBeNull();
    });
});
