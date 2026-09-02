"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const profile_controller_1 = require("../../src/controllers/profile.controller");
function buildMockResponse() {
    return {
        status: globals_1.jest.fn().mockReturnThis(),
        json: globals_1.jest.fn().mockReturnThis(),
    };
}
function buildProfile() {
    return {
        id: 1,
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
        phone: "0800000000",
        dateOfBirth: "1990-01-20",
        status: "active",
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
(0, globals_1.describe)("ProfileController", () => {
    function buildController() {
        const profileServiceMock = {
            createProfile: globals_1.jest.fn(),
            getProfileById: globals_1.jest.fn(),
            updateProfile: globals_1.jest.fn(),
        };
        return { controller: new profile_controller_1.ProfileController(profileServiceMock), profileServiceMock };
    }
    (0, globals_1.describe)("createProfile", () => {
        (0, globals_1.it)("returns 200 with the created profile for a valid payload", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            const createdProfile = buildProfile();
            profileServiceMock.createProfile.mockResolvedValue(createdProfile);
            const request = { body: validCreateBody };
            const response = buildMockResponse();
            // Act
            await controller.createProfile(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
            (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultData: globals_1.expect.objectContaining({ id: 1 }) }));
        });
        (0, globals_1.it)("returns 400 for an invalid payload", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            const request = { body: { firstName: "OnlyName" } };
            const response = buildMockResponse();
            // Act
            await controller.createProfile(request, response);
            // Assert
            (0, globals_1.expect)(profileServiceMock.createProfile).not.toHaveBeenCalled();
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        });
        (0, globals_1.it)("returns 500 when the service throws", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.createProfile.mockRejectedValue(new Error("db down"));
            const request = { body: validCreateBody };
            const response = buildMockResponse();
            // Act
            await controller.createProfile(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(500);
        });
    });
    (0, globals_1.describe)("getProfileById", () => {
        (0, globals_1.it)("returns 200 with the profile when found", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.getProfileById.mockResolvedValue(buildProfile());
            const request = { query: { id: "1" } };
            const response = buildMockResponse();
            // Act
            await controller.getProfileById(request, response);
            // Assert
            (0, globals_1.expect)(profileServiceMock.getProfileById).toHaveBeenCalledWith(1);
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
        });
        (0, globals_1.it)("returns 400 for an invalid id", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            const request = { query: { id: "abc" } };
            const response = buildMockResponse();
            // Act
            await controller.getProfileById(request, response);
            // Assert
            (0, globals_1.expect)(profileServiceMock.getProfileById).not.toHaveBeenCalled();
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        });
        (0, globals_1.it)("returns 404 when the profile is not found", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.getProfileById.mockResolvedValue(null);
            const request = { query: { id: "999" } };
            const response = buildMockResponse();
            // Act
            await controller.getProfileById(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(404);
        });
        (0, globals_1.it)("returns 500 when the service throws", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.getProfileById.mockRejectedValue(new Error("db down"));
            const request = { query: { id: "1" } };
            const response = buildMockResponse();
            // Act
            await controller.getProfileById(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(500);
        });
    });
    (0, globals_1.describe)("updateProfile", () => {
        (0, globals_1.it)("returns 200 with the updated profile", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.updateProfile.mockResolvedValue({ status: "updated", profile: buildProfile() });
            const request = { body: { id: 1, firstName: "Robert" } };
            const response = buildMockResponse();
            // Act
            await controller.updateProfile(request, response);
            // Assert
            (0, globals_1.expect)(profileServiceMock.updateProfile).toHaveBeenCalledWith(1, { firstName: "Robert" });
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
        });
        (0, globals_1.it)("returns 400 for an invalid profile id", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            const request = { body: { id: "abc", firstName: "Robert" } };
            const response = buildMockResponse();
            // Act
            await controller.updateProfile(request, response);
            // Assert
            (0, globals_1.expect)(profileServiceMock.updateProfile).not.toHaveBeenCalled();
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        });
        (0, globals_1.it)("returns 400 for an invalid update payload", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            const request = { body: { id: 1 } };
            const response = buildMockResponse();
            // Act
            await controller.updateProfile(request, response);
            // Assert
            (0, globals_1.expect)(profileServiceMock.updateProfile).not.toHaveBeenCalled();
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        });
        (0, globals_1.it)("returns 404 when the profile does not exist", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.updateProfile.mockResolvedValue({ status: "not-found" });
            const request = { body: { id: 999, firstName: "Robert" } };
            const response = buildMockResponse();
            // Act
            await controller.updateProfile(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(404);
        });
        (0, globals_1.it)("returns 409 when the profile is inactive", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.updateProfile.mockResolvedValue({ status: "inactive" });
            const request = { body: { id: 2, firstName: "Robert" } };
            const response = buildMockResponse();
            // Act
            await controller.updateProfile(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(409);
        });
        (0, globals_1.it)("returns 500 when the service throws", async () => {
            // Arrange
            const { controller, profileServiceMock } = buildController();
            profileServiceMock.updateProfile.mockRejectedValue(new Error("db down"));
            const request = { body: { id: 1, firstName: "Robert" } };
            const response = buildMockResponse();
            // Act
            await controller.updateProfile(request, response);
            // Assert
            (0, globals_1.expect)(response.status).toHaveBeenCalledWith(500);
        });
    });
});
