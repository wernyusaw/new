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
const mysql_profile_repository_1 = require("../../src/repositories/mysql-profile.repository");
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
const createInput = {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "0800000000",
    dateOfBirth: "1990-01-20",
    status: "active",
    address: { line1: "123 Main St", city: "Bangkok", state: "Bangkok", postalCode: "10100", country: "Thailand" },
    preferences: { allowMarketing: true },
};
const joinedRow = {
    id: 123,
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice@example.com",
    phone: "0800000000",
    date_of_birth: "1990-01-20",
    status: "active",
    version: 1,
    line1: "123 Main St",
    line2: null,
    city: "Bangkok",
    state: "Bangkok",
    postal_code: "10100",
    country: "Thailand",
    allow_marketing: 1,
};
(0, globals_1.describe)("MySqlProfileRepository", () => {
    let connectionExecuteMock;
    let poolExecuteMock;
    let connection;
    (0, globals_1.beforeEach)(() => {
        connectionExecuteMock = globals_1.jest.fn();
        poolExecuteMock = globals_1.jest.fn();
        connection = {
            beginTransaction: globals_1.jest.fn(),
            execute: connectionExecuteMock,
            commit: globals_1.jest.fn(),
            rollback: globals_1.jest.fn(),
            release: globals_1.jest.fn(),
        };
        globals_1.jest.spyOn(mysqlModule, "getMySqlPool").mockResolvedValue({
            execute: poolExecuteMock,
            getConnection: globals_1.jest.fn().mockResolvedValue(connection),
        });
    });
    (0, globals_1.describe)("createProfile", () => {
        (0, globals_1.it)("inserts profile, address, preferences and audit rows, then returns the created profile", async () => {
            // Arrange
            connectionExecuteMock.mockResolvedValueOnce([{ insertId: 123 }]).mockResolvedValue([{}]);
            poolExecuteMock.mockResolvedValue([[joinedRow]]);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act
            const result = await repository.createProfile(createInput);
            // Assert
            (0, globals_1.expect)(connection.beginTransaction).toHaveBeenCalled();
            (0, globals_1.expect)(connectionExecuteMock).toHaveBeenCalledTimes(4);
            (0, globals_1.expect)(connection.commit).toHaveBeenCalled();
            (0, globals_1.expect)(connection.release).toHaveBeenCalled();
            (0, globals_1.expect)(result).toEqual({
                id: 123,
                firstName: "Alice",
                lastName: "Johnson",
                email: "alice@example.com",
                phone: "0800000000",
                dateOfBirth: "1990-01-20",
                status: "active",
                version: 1,
                address: {
                    line1: "123 Main St",
                    line2: undefined,
                    city: "Bangkok",
                    state: "Bangkok",
                    postalCode: "10100",
                    country: "Thailand",
                },
                preferences: { allowMarketing: true },
            });
        });
        (0, globals_1.it)("rolls back and rethrows when an insert fails", async () => {
            // Arrange
            const insertError = new Error("insert failed");
            connectionExecuteMock.mockResolvedValueOnce([{ insertId: 123 }]).mockRejectedValueOnce(insertError);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act & Assert
            await (0, globals_1.expect)(repository.createProfile(createInput)).rejects.toThrow("insert failed");
            (0, globals_1.expect)(connection.rollback).toHaveBeenCalled();
            (0, globals_1.expect)(connection.release).toHaveBeenCalled();
        });
    });
    (0, globals_1.describe)("getProfileById", () => {
        (0, globals_1.it)("returns the mapped profile when found", async () => {
            // Arrange
            poolExecuteMock.mockResolvedValue([[joinedRow]]);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act
            const result = await repository.getProfileById(123);
            // Assert
            (0, globals_1.expect)(result?.id).toBe(123);
            (0, globals_1.expect)(result?.preferences.allowMarketing).toBe(true);
        });
        (0, globals_1.it)("returns null when no rows are found", async () => {
            // Arrange
            poolExecuteMock.mockResolvedValue([[]]);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act
            const result = await repository.getProfileById(999);
            // Assert
            (0, globals_1.expect)(result).toBeNull();
        });
    });
    (0, globals_1.describe)("updateProfile", () => {
        (0, globals_1.it)("returns not-found when the profile row does not exist", async () => {
            // Arrange
            connectionExecuteMock.mockResolvedValueOnce([[]]);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act
            const result = await repository.updateProfile(999, { firstName: "Robert" });
            // Assert
            (0, globals_1.expect)(result).toEqual({ status: "not-found" });
            (0, globals_1.expect)(connection.rollback).toHaveBeenCalled();
        });
        (0, globals_1.it)("returns inactive when the profile is not active", async () => {
            // Arrange
            connectionExecuteMock.mockResolvedValueOnce([[{ status: "inactive" }]]);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act
            const result = await repository.updateProfile(1, { firstName: "Robert" });
            // Assert
            (0, globals_1.expect)(result).toEqual({ status: "inactive" });
            (0, globals_1.expect)(connection.rollback).toHaveBeenCalled();
        });
        (0, globals_1.it)("updates an active profile and returns the refreshed profile", async () => {
            // Arrange
            connectionExecuteMock.mockResolvedValueOnce([[{ status: "active" }]]).mockResolvedValue([{}]);
            poolExecuteMock.mockResolvedValue([[{ ...joinedRow, first_name: "Robert" }]]);
            const repository = new mysql_profile_repository_1.MySqlProfileRepository(appConfigMock);
            // Act
            const result = await repository.updateProfile(123, { firstName: "Robert" });
            // Assert
            (0, globals_1.expect)(connection.commit).toHaveBeenCalled();
            (0, globals_1.expect)(result).toEqual({
                status: "updated",
                profile: globals_1.expect.objectContaining({ id: 123, firstName: "Robert" }),
            });
        });
    });
});
