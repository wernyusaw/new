import { describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

import { ProfileController } from "../../src/controllers/profile.controller";
import type { ProfileServicePort } from "../../src/interfaces/profile-service.port";

function buildMockResponse(): jest.Mocked<Response> {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
}

function buildProfile() {
  return {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "0800000000",
    dateOfBirth: "1990-01-20",
    status: "active" as const,
    version: 1,
    address: { line1: "123 Main St", city: "Bangkok", state: "Bangkok", postalCode: "10100", country: "Thailand" },
    preferences: { allowMarketing: true },
  };
}

const validCreateBody = {
  firstName: "Alice",
  lastName: "Johnson",
  email: "alice@example.com",
  phone: "0800000000",
  dateOfBirth: "1990-01-20",
  status: "active",
  address: { line1: "123 Main St", city: "Bangkok", state: "Bangkok", postalCode: "10100", country: "Thailand" },
  preferences: { allowMarketing: true },
};

describe("ProfileController", () => {
  function buildController() {
    const profileServiceMock: jest.Mocked<ProfileServicePort> = {
      createProfile: jest.fn(),
      getProfileById: jest.fn(),
      updateProfile: jest.fn(),
    };

    return { controller: new ProfileController(profileServiceMock), profileServiceMock };
  }

  describe("createProfile", () => {
    it("returns 200 with the created profile for a valid payload", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      const createdProfile = buildProfile();
      profileServiceMock.createProfile.mockResolvedValue(createdProfile);
      const request = { body: validCreateBody } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.createProfile(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ resultData: expect.objectContaining({ id: 1 }) }),
      );
    });

    it("returns 400 for an invalid payload", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      const request = { body: { firstName: "OnlyName" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.createProfile(request, response);

      // Assert
      expect(profileServiceMock.createProfile).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
    });

    it("returns 500 when the service throws", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.createProfile.mockRejectedValue(new Error("db down"));
      const request = { body: validCreateBody } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.createProfile(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getProfileById", () => {
    it("returns 200 with the profile when found", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.getProfileById.mockResolvedValue(buildProfile());
      const request = { query: { id: "1" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.getProfileById(request, response);

      // Assert
      expect(profileServiceMock.getProfileById).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("returns 400 for an invalid id", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      const request = { query: { id: "abc" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.getProfileById(request, response);

      // Assert
      expect(profileServiceMock.getProfileById).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
    });

    it("returns 404 when the profile is not found", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.getProfileById.mockResolvedValue(null);
      const request = { query: { id: "999" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.getProfileById(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(404);
    });

    it("returns 500 when the service throws", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.getProfileById.mockRejectedValue(new Error("db down"));
      const request = { query: { id: "1" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.getProfileById(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateProfile", () => {
    it("returns 200 with the updated profile", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.updateProfile.mockResolvedValue({ status: "updated", profile: buildProfile() });
      const request = { body: { id: 1, firstName: "Robert" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.updateProfile(request, response);

      // Assert
      expect(profileServiceMock.updateProfile).toHaveBeenCalledWith(1, { firstName: "Robert" });
      expect(response.status).toHaveBeenCalledWith(200);
    });

    it("returns 400 for an invalid profile id", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      const request = { body: { id: "abc", firstName: "Robert" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.updateProfile(request, response);

      // Assert
      expect(profileServiceMock.updateProfile).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 for an invalid update payload", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      const request = { body: { id: 1 } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.updateProfile(request, response);

      // Assert
      expect(profileServiceMock.updateProfile).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
    });

    it("returns 404 when the profile does not exist", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.updateProfile.mockResolvedValue({ status: "not-found" });
      const request = { body: { id: 999, firstName: "Robert" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.updateProfile(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(404);
    });

    it("returns 409 when the profile is inactive", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.updateProfile.mockResolvedValue({ status: "inactive" });
      const request = { body: { id: 2, firstName: "Robert" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.updateProfile(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(409);
    });

    it("returns 500 when the service throws", async () => {
      // Arrange
      const { controller, profileServiceMock } = buildController();
      profileServiceMock.updateProfile.mockRejectedValue(new Error("db down"));
      const request = { body: { id: 1, firstName: "Robert" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.updateProfile(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(500);
    });
  });
});
