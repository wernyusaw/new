"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const profile_service_1 = require("../../src/services/profile.service");
function buildProfile(overrides = {}) {
    return {
        id: 1,
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@example.com",
        phone: "0800000000",
        dateOfBirth: "1990-01-20",
        status: "active",
        version: 1,
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
        ...overrides,
    };
}
(0, globals_1.describe)("ProfileService", () => {
    function buildService() {
        const repositoryMock = {
            createProfile: globals_1.jest.fn(),
            getProfileById: globals_1.jest.fn(),
            updateProfile: globals_1.jest.fn(),
        };
        return { service: new profile_service_1.ProfileService(repositoryMock), repositoryMock };
    }
    (0, globals_1.it)("delegates createProfile to the repository", async () => {
        // Arrange
        const { service, repositoryMock } = buildService();
        const input = {
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice@example.com",
            phone: "0800000000",
            dateOfBirth: "1990-01-20",
            status: "active",
            address: { line1: "123 Main St", city: "Bangkok", state: "Bangkok", postalCode: "10100", country: "Thailand" },
            preferences: { allowMarketing: true },
        };
        const createdProfile = buildProfile();
        repositoryMock.createProfile.mockResolvedValue(createdProfile);
        // Act
        const result = await service.createProfile(input);
        // Assert
        (0, globals_1.expect)(repositoryMock.createProfile).toHaveBeenCalledWith(input);
        (0, globals_1.expect)(result).toBe(createdProfile);
    });
    (0, globals_1.it)("returns the profile when getProfileById finds a match", async () => {
        // Arrange
        const { service, repositoryMock } = buildService();
        const profile = buildProfile();
        repositoryMock.getProfileById.mockResolvedValue(profile);
        // Act
        const result = await service.getProfileById(1);
        // Assert
        (0, globals_1.expect)(repositoryMock.getProfileById).toHaveBeenCalledWith(1);
        (0, globals_1.expect)(result).toBe(profile);
    });
    (0, globals_1.it)("returns null when getProfileById finds no match", async () => {
        // Arrange
        const { service, repositoryMock } = buildService();
        repositoryMock.getProfileById.mockResolvedValue(null);
        // Act
        const result = await service.getProfileById(999);
        // Assert
        (0, globals_1.expect)(result).toBeNull();
    });
    (0, globals_1.it)("delegates updateProfile to the repository and returns its result", async () => {
        // Arrange
        const { service, repositoryMock } = buildService();
        const updateResult = { status: "updated", profile: buildProfile({ firstName: "Robert" }) };
        repositoryMock.updateProfile.mockResolvedValue(updateResult);
        // Act
        const result = await service.updateProfile(1, { firstName: "Robert" });
        // Assert
        (0, globals_1.expect)(repositoryMock.updateProfile).toHaveBeenCalledWith(1, { firstName: "Robert" });
        (0, globals_1.expect)(result).toEqual(updateResult);
    });
    (0, globals_1.it)("propagates a not-found result from the repository", async () => {
        // Arrange
        const { service, repositoryMock } = buildService();
        repositoryMock.updateProfile.mockResolvedValue({ status: "not-found" });
        // Act
        const result = await service.updateProfile(404, {});
        // Assert
        (0, globals_1.expect)(result).toEqual({ status: "not-found" });
    });
    (0, globals_1.it)("propagates an inactive result from the repository", async () => {
        // Arrange
        const { service, repositoryMock } = buildService();
        repositoryMock.updateProfile.mockResolvedValue({ status: "inactive" });
        // Act
        const result = await service.updateProfile(2, {});
        // Assert
        (0, globals_1.expect)(result).toEqual({ status: "inactive" });
    });
});
