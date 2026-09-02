"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const profile_response_mapper_1 = require("../../src/mappers/response/profile-response.mapper");
(0, globals_1.describe)("profile response mapper", () => {
    (0, globals_1.it)("returns the profile dto unchanged", () => {
        const profile = {
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
        };
        (0, globals_1.expect)((0, profile_response_mapper_1.mapProfileResponse)(profile)).toBe(profile);
        (0, globals_1.expect)((0, profile_response_mapper_1.mapProfileResponse)(profile)).toEqual(profile);
    });
});
