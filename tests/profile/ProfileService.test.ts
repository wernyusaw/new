import { describe, expect, it, jest } from "@jest/globals";

import type { ProfileRepositoryPort } from "../../src/interfaces/profile-repository.port";
import { ProfileService } from "../../src/services/profile.service";

function buildProfile(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "0800000000",
    dateOfBirth: "1990-01-20",
    status: "active" as const,
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

describe("ProfileService", () => {
  function buildService() {
    const repositoryMock: jest.Mocked<ProfileRepositoryPort> = {
      createProfile: jest.fn(),
      getProfileById: jest.fn(),
      updateProfile: jest.fn(),
    };

    return { service: new ProfileService(repositoryMock), repositoryMock };
  }

  it("delegates createProfile to the repository", async () => {
    // Arrange
    const { service, repositoryMock } = buildService();
    const input = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "0800000000",
      dateOfBirth: "1990-01-20",
      status: "active" as const,
      address: { line1: "123 Main St", city: "Bangkok", state: "Bangkok", postalCode: "10100", country: "Thailand" },
      preferences: { allowMarketing: true },
    };
    const createdProfile = buildProfile();
    repositoryMock.createProfile.mockResolvedValue(createdProfile);

    // Act
    const result = await service.createProfile(input);

    // Assert
    expect(repositoryMock.createProfile).toHaveBeenCalledWith(input);
    expect(result).toBe(createdProfile);
  });

  it("returns the profile when getProfileById finds a match", async () => {
    // Arrange
    const { service, repositoryMock } = buildService();
    const profile = buildProfile();
    repositoryMock.getProfileById.mockResolvedValue(profile);

    // Act
    const result = await service.getProfileById(1);

    // Assert
    expect(repositoryMock.getProfileById).toHaveBeenCalledWith(1);
    expect(result).toBe(profile);
  });

  it("returns null when getProfileById finds no match", async () => {
    // Arrange
    const { service, repositoryMock } = buildService();
    repositoryMock.getProfileById.mockResolvedValue(null);

    // Act
    const result = await service.getProfileById(999);

    // Assert
    expect(result).toBeNull();
  });

  it("delegates updateProfile to the repository and returns its result", async () => {
    // Arrange
    const { service, repositoryMock } = buildService();
    const updateResult = { status: "updated" as const, profile: buildProfile({ firstName: "Robert" }) };
    repositoryMock.updateProfile.mockResolvedValue(updateResult);

    // Act
    const result = await service.updateProfile(1, { firstName: "Robert" });

    // Assert
    expect(repositoryMock.updateProfile).toHaveBeenCalledWith(1, { firstName: "Robert" });
    expect(result).toEqual(updateResult);
  });

  it("propagates a not-found result from the repository", async () => {
    // Arrange
    const { service, repositoryMock } = buildService();
    repositoryMock.updateProfile.mockResolvedValue({ status: "not-found" });

    // Act
    const result = await service.updateProfile(404, {});

    // Assert
    expect(result).toEqual({ status: "not-found" });
  });

  it("propagates an inactive result from the repository", async () => {
    // Arrange
    const { service, repositoryMock } = buildService();
    repositoryMock.updateProfile.mockResolvedValue({ status: "inactive" });

    // Act
    const result = await service.updateProfile(2, {});

    // Assert
    expect(result).toEqual({ status: "inactive" });
  });
});
