import { describe, expect, it } from "@jest/globals";

import { NoopProfileRepository } from "../../src/repositories/noop-profile.repository";
import type { CreateProfileRequestDto } from "../../src/dtos/request/profile/create-profile-request.dto";

function buildCreateInput(overrides: Partial<CreateProfileRequestDto> = {}): CreateProfileRequestDto {
  return {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "0800000000",
    dateOfBirth: "1990-01-20",
    status: "active",
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

describe("NoopProfileRepository", () => {
  it("creates a profile with an auto-incrementing id starting at 1", async () => {
    // Arrange
    const repository = new NoopProfileRepository();

    // Act
    const first = await repository.createProfile(buildCreateInput());
    const second = await repository.createProfile(buildCreateInput({ firstName: "Bob" }));

    // Assert
    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
    expect(first.version).toBe(1);
  });

  it("returns the created profile via getProfileById", async () => {
    // Arrange
    const repository = new NoopProfileRepository();
    const created = await repository.createProfile(buildCreateInput());

    // Act
    const result = await repository.getProfileById(created.id);

    // Assert
    expect(result).toEqual(created);
  });

  it("returns null from getProfileById when no profile exists", async () => {
    // Arrange
    const repository = new NoopProfileRepository();

    // Act
    const result = await repository.getProfileById(999);

    // Assert
    expect(result).toBeNull();
  });

  it("returns not-found when updating a profile that does not exist", async () => {
    // Arrange
    const repository = new NoopProfileRepository();

    // Act
    const result = await repository.updateProfile(999, { firstName: "X" });

    // Assert
    expect(result).toEqual({ status: "not-found" });
  });

  it("returns inactive when updating an inactive profile", async () => {
    // Arrange
    const repository = new NoopProfileRepository();
    const created = await repository.createProfile(buildCreateInput({ status: "inactive" }));

    // Act
    const result = await repository.updateProfile(created.id, { firstName: "X" });

    // Assert
    expect(result).toEqual({ status: "inactive" });
  });

  it("updates an active profile, merging partial fields and bumping version", async () => {
    // Arrange
    const repository = new NoopProfileRepository();
    const created = await repository.createProfile(buildCreateInput());

    // Act
    const result = await repository.updateProfile(created.id, {
      firstName: "Robert",
      address: { city: "Chiang Mai" },
    });

    // Assert
    expect(result.status).toBe("updated");
    if (result.status === "updated") {
      expect(result.profile.firstName).toBe("Robert");
      expect(result.profile.lastName).toBe("Johnson");
      expect(result.profile.address.city).toBe("Chiang Mai");
      expect(result.profile.address.line1).toBe("123 Main St");
      expect(result.profile.version).toBe(2);
    }
  });
});
