import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import { MySqlProfileRepository } from "../../src/repositories/mysql-profile.repository";
import * as mysqlModule from "../../src/db/mysql";
import type { AppConfig } from "../../src/interfaces/app-config";
import type { CreateProfileRequestDto } from "../../src/dtos/request/profile/create-profile-request.dto";

jest.mock("../../src/db/mysql");

const appConfigMock: AppConfig = {
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

const createInput: CreateProfileRequestDto = {
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
  status: "active" as const,
  version: 1,
  line1: "123 Main St",
  line2: null,
  city: "Bangkok",
  state: "Bangkok",
  postal_code: "10100",
  country: "Thailand",
  allow_marketing: 1 as const,
};

describe("MySqlProfileRepository", () => {
  let connectionExecuteMock: jest.Mock;
  let poolExecuteMock: jest.Mock;
  let connection: {
    beginTransaction: jest.Mock;
    execute: jest.Mock;
    commit: jest.Mock;
    rollback: jest.Mock;
    release: jest.Mock;
  };

  beforeEach(() => {
    connectionExecuteMock = jest.fn();
    poolExecuteMock = jest.fn();
    connection = {
      beginTransaction: jest.fn(),
      execute: connectionExecuteMock,
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    };

    jest.spyOn(mysqlModule, "getMySqlPool").mockResolvedValue({
      execute: poolExecuteMock,
      getConnection: jest.fn().mockResolvedValue(connection),
    } as never);
  });

  describe("createProfile", () => {
    it("inserts profile, address, preferences and audit rows, then returns the created profile", async () => {
      // Arrange
      connectionExecuteMock.mockResolvedValueOnce([{ insertId: 123 }]).mockResolvedValue([{}]);
      poolExecuteMock.mockResolvedValue([[joinedRow]]);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act
      const result = await repository.createProfile(createInput);

      // Assert
      expect(connection.beginTransaction).toHaveBeenCalled();
      expect(connectionExecuteMock).toHaveBeenCalledTimes(4);
      expect(connection.commit).toHaveBeenCalled();
      expect(connection.release).toHaveBeenCalled();
      expect(result).toEqual({
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

    it("rolls back and rethrows when an insert fails", async () => {
      // Arrange
      const insertError = new Error("insert failed");
      connectionExecuteMock.mockResolvedValueOnce([{ insertId: 123 }]).mockRejectedValueOnce(insertError);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act & Assert
      await expect(repository.createProfile(createInput)).rejects.toThrow("insert failed");
      expect(connection.rollback).toHaveBeenCalled();
      expect(connection.release).toHaveBeenCalled();
    });
  });

  describe("getProfileById", () => {
    it("returns the mapped profile when found", async () => {
      // Arrange
      poolExecuteMock.mockResolvedValue([[joinedRow]]);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act
      const result = await repository.getProfileById(123);

      // Assert
      expect(result?.id).toBe(123);
      expect(result?.preferences.allowMarketing).toBe(true);
    });

    it("returns null when no rows are found", async () => {
      // Arrange
      poolExecuteMock.mockResolvedValue([[]]);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act
      const result = await repository.getProfileById(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("returns not-found when the profile row does not exist", async () => {
      // Arrange
      connectionExecuteMock.mockResolvedValueOnce([[]]);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act
      const result = await repository.updateProfile(999, { firstName: "Robert" });

      // Assert
      expect(result).toEqual({ status: "not-found" });
      expect(connection.rollback).toHaveBeenCalled();
    });

    it("returns inactive when the profile is not active", async () => {
      // Arrange
      connectionExecuteMock.mockResolvedValueOnce([[{ status: "inactive" }]]);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act
      const result = await repository.updateProfile(1, { firstName: "Robert" });

      // Assert
      expect(result).toEqual({ status: "inactive" });
      expect(connection.rollback).toHaveBeenCalled();
    });

    it("updates an active profile and returns the refreshed profile", async () => {
      // Arrange
      connectionExecuteMock.mockResolvedValueOnce([[{ status: "active" }]]).mockResolvedValue([{}]);
      poolExecuteMock.mockResolvedValue([[{ ...joinedRow, first_name: "Robert" }]]);
      const repository = new MySqlProfileRepository(appConfigMock);

      // Act
      const result = await repository.updateProfile(123, { firstName: "Robert" });

      // Assert
      expect(connection.commit).toHaveBeenCalled();
      expect(result).toEqual({
        status: "updated",
        profile: expect.objectContaining({ id: 123, firstName: "Robert" }),
      });
    });
  });
});
