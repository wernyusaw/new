"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const noop_profile_repository_1 = require("../../src/repositories/noop-profile.repository");
function buildCreateInput(overrides = {}) {
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
(0, globals_1.describe)("NoopProfileRepository", () => {
    (0, globals_1.it)("creates a profile with an auto-incrementing id starting at 1", async () => {
        // Arrange
        const repository = new noop_profile_repository_1.NoopProfileRepository();
        // Act
        const first = await repository.createProfile(buildCreateInput());
        const second = await repository.createProfile(buildCreateInput({ firstName: "Bob" }));
        // Assert
        (0, globals_1.expect)(first.id).toBe(1);
        (0, globals_1.expect)(second.id).toBe(2);
        (0, globals_1.expect)(first.version).toBe(1);
    });
    (0, globals_1.it)("returns the created profile via getProfileById", async () => {
        // Arrange
        const repository = new noop_profile_repository_1.NoopProfileRepository();
        const created = await repository.createProfile(buildCreateInput());
        // Act
        const result = await repository.getProfileById(created.id);
        // Assert
        (0, globals_1.expect)(result).toEqual(created);
    });
    (0, globals_1.it)("returns null from getProfileById when no profile exists", async () => {
        // Arrange
        const repository = new noop_profile_repository_1.NoopProfileRepository();
        // Act
        const result = await repository.getProfileById(999);
        // Assert
        (0, globals_1.expect)(result).toBeNull();
    });
    (0, globals_1.it)("returns not-found when updating a profile that does not exist", async () => {
        // Arrange
        const repository = new noop_profile_repository_1.NoopProfileRepository();
        // Act
        const result = await repository.updateProfile(999, { firstName: "X" });
        // Assert
        (0, globals_1.expect)(result).toEqual({ status: "not-found" });
    });
    (0, globals_1.it)("returns inactive when updating an inactive profile", async () => {
        // Arrange
        const repository = new noop_profile_repository_1.NoopProfileRepository();
        const created = await repository.createProfile(buildCreateInput({ status: "inactive" }));
        // Act
        const result = await repository.updateProfile(created.id, { firstName: "X" });
        // Assert
        (0, globals_1.expect)(result).toEqual({ status: "inactive" });
    });
    (0, globals_1.it)("updates an active profile, merging partial fields and bumping version", async () => {
        // Arrange
        const repository = new noop_profile_repository_1.NoopProfileRepository();
        const created = await repository.createProfile(buildCreateInput());
        // Act
        const result = await repository.updateProfile(created.id, {
            firstName: "Robert",
            address: { city: "Chiang Mai" },
        });
        // Assert
        (0, globals_1.expect)(result.status).toBe("updated");
        if (result.status === "updated") {
            (0, globals_1.expect)(result.profile.firstName).toBe("Robert");
            (0, globals_1.expect)(result.profile.lastName).toBe("Johnson");
            (0, globals_1.expect)(result.profile.address.city).toBe("Chiang Mai");
            (0, globals_1.expect)(result.profile.address.line1).toBe("123 Main St");
            (0, globals_1.expect)(result.profile.version).toBe(2);
        }
    });
});
